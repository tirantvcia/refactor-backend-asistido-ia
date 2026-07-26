import { Order } from "../../domain/entities";
import { OrderStatus } from "../../domain/models";
import { OrderRepository } from "../../domain/repositories";
import { Address, Id, OrderLine, PositiveNumber } from "../../domain/valueObjects";
import { OrderModel } from "../../models/orderModel";

class OrderMongoRepository implements OrderRepository {
    
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
describe("The order Mongo repository", () => {
    beforeAll(
        async () => {
                const dbUrl = "mongodb://127.0.0.1:27017/db_orders_mongo_repository";
                await mongoose.connect(dbUrl);
                await mongoose.connection.dropDatabase();
        }
    );


    it("saves and retrieve a given new valid order", async () => {
        //Arrange
        const items : OrderLine[] =  [OrderLine.create(Id.create(), PositiveNumber.create(2), PositiveNumber.create(3))];
        const address = Address.create("Calle Falsa 123");
        const order = Order.create(address, items);
        const repository = new OrderMongoRepository();
        //Act
        await repository.save(order);
        //Assert
        const savedOrder = await repository.findById(order.id);
        expect(savedOrder?.id).toEqual(order.id);
        expect(savedOrder?.shippingAddress).toEqual(order.shippingAddress);
    });
});
