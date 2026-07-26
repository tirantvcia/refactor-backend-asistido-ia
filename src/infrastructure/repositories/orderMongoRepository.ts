import { Order } from "../../domain/entities";
import { OrderStatus } from "../../domain/models";
import { OrderRepository } from "../../domain/repositories";
import { Id } from "../../domain/valueObjects";
import { OrderModel } from "./orderModel";


export class OrderMongoRepository implements OrderRepository {
    
    async findAll(): Promise<Order[]> {
        return [];
    }
    async findById(id: Id): Promise<Order | undefined> {
        const orderDocument = await OrderModel.findById(id);
        if (!orderDocument) {
             return undefined;
        }
        const orderDto = {
            id: orderDocument._id.toString(),
            shippingAddress: orderDocument.shippingAddress,
            items: orderDocument.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
            })),
            discountCode: orderDocument.discountCode,
            status: orderDocument.status as OrderStatus
        }

        const order = Order.fromDto(orderDto);
        return order;
    }
    
    async save(order: Order): Promise<void> {
        const orderDto = order.toDto();
        const mongoOrder = new OrderModel({
                    _id: orderDto.id,
                    shippingAddress: orderDto.shippingAddress,
                    status: orderDto.status,
                    items: orderDto.items,  
                    total: order.calculateTotal().value
        });
        await mongoOrder.save();
    }
    async delete(id: Id): Promise<void> {
        // Simulate deleting the order from MongoDB
    }
}