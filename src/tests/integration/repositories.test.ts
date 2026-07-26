import mongoose from "mongoose";
import { Order } from "../../domain/entities";
import { Address, Id, OrderLine, PositiveNumber } from "../../domain/valueObjects";
import { OrderMongoRepository } from "../../infrastructure/repositories/orderMongoRepository";



describe("The order Mongo repository", () => {
    beforeAll(
        async () => {
                const dbUrl = "mongodb://127.0.0.1:27017/db_orders_mongo_repository";
                await mongoose.connect(dbUrl);
                await mongoose.connection.dropDatabase();
        }
    );

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it("saves and retrieves a given new valid order", async () => {
        //Arrange
        const items : OrderLine[] =  [OrderLine.create(Id.create(), PositiveNumber.create(2), PositiveNumber.create(3))];
        const address = Address.create("Calle Falsa 123");
        const order = Order.create(address, items);
        const repository = new OrderMongoRepository();
        //Act
        await repository.save(order);
        //Assert

        const savedOrder = await repository.findById(order.id);
        expect (savedOrder?.id).toEqual(order.id);
        expect (savedOrder?.shippingAddress).toEqual(order.shippingAddress);
    });
});


