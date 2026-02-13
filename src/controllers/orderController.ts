import { Request, Response } from 'express';
import { OrderModel } from '../models/orderModel';
import { OrderStatus } from '../domain/models';
import { Address, Id, OrderLine, PositiveNumber } from '../domain/valueObjects';
import { Order } from '../domain/entities';
import { DomainError } from '../domain/error';

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
    console.log("POST /orders");
    try {
        const { items, discountCode, shippingAddress } = req.body;

        const address = Address.create(shippingAddress);
        let orderLines: OrderLine[] = [];
        if (items && Array.isArray(items) && items.length > 0) {
            orderLines = items.map((item: any) => {
                return OrderLine.create(
                    Id.from(item.productId),
                    PositiveNumber.create(item.quantity),
                    PositiveNumber.create(item.price)
                );
            });
        }

    
        const order = Order.create(address, orderLines, discountCode);

        let total = order.calculateTotal().value;

        const newOrder = new OrderModel(order.toDto());
        console.log('Creating order with total: ' + total);
        await newOrder.save();
        res.send(`Order created with total: ${total}`);

    } catch (error: any) {
        if(error instanceof DomainError) {
            return res.status(400).send(error.message);    
        }
        return res.status(500).send("Unexpected error");
    }

};

// Get all orders
export const getAllOrders = async (_req: Request, res: Response) => {
    console.log("GET /orders");
    const orders = await OrderModel.find();
    res.json(orders);
};

// Update order
export const updateOrder = async (req: Request, res: Response) => {
    console.log("PUT /orders/:id");
    const { id } = req.params;
    const { status, shippingAddress, discountCode } = req.body;

    const order = await OrderModel.findById(id);
    if (!order) {
        return res.status(404).send('Order not found');
    }

    if (shippingAddress) {
        order.shippingAddress = shippingAddress;
    }

    if (status) {
        if (status === OrderStatus.COMPLETED && order.items.length === 0) {
            return res.send('Cannot complete an order without items');
        }
        order.status = status;
    }

    if (discountCode) {
        order.discountCode = discountCode;
        if (discountCode === 'DISCOUNT20') {
            let newTotal = 0;
            for (const item of order.items) {
                newTotal += (item.price || 0) * (item.quantity || 0);
            }
            newTotal *= 0.8;
            order.total = newTotal;
        } else {
            console.log('Invalid or not implemented discount code');
        }
    }

    await order.save();
    res.send(`Order updated. New status: ${order.status}`);
};

// Complete order
export const completeOrder = async (req: Request, res: Response) => {
    console.log("POST /orders/:id/complete");
    const { id } = req.params;

    const order = await OrderModel.findById(id);
    if (!order) {
        return res.status(400).send('Order not found to complete');
    }

    if (order.status !== OrderStatus.CREATED) {
        return res.status(400).send(`Cannot complete an order with status: ${order.status}`);
    }

    order.status = OrderStatus.COMPLETED;
    await order.save();
    res.send(`Order with id ${id} completed`);
};

// Complete order
export const completeOrderNew= async (req: Request, res: Response) => {
    console.log("POST /orders/:id/complete");

    try {
        const { id } = req.params;

        const orderDocument = await OrderModel.findById(id);
        if (!orderDocument) {
            return res.status(400).send('Order not found to complete');
        }

        const orderDto = {
            id: orderDocument._id.toString(),
            shippingAddress: orderDocument.shippingAddress,
            thisLines: orderDocument.items,
            discountCode: orderDocument.discountCode,
            status: orderDocument.status as OrderStatus
        }

        const order = Order.fromDto(orderDto);
        order.completeOrder();        
        const newOrder = new OrderModel(order.toDto());
        await newOrder.save();
        res.send(`Order with id ${id} completed`);
    
    } catch (error: any) {
        if(error instanceof DomainError) {
            return res.status(400).send(error.message);    
        }
        return res.status(500).send("Unexpected error");
    }

};

// Delete order
export const deleteOrder = async (req: Request, res: Response) => {
    console.log("DELETE /orders/:id");
    try {
        await OrderModel.findByIdAndDelete(req.params.id);
        console.log("DELETE order " + req.params.id +" found and deleted");
        res.send('Order deleted');
    } catch (error) {
        console.log("DELETE order " + req.params.id +" not found");
        res.status(404).send('Order not found');
    }

};
