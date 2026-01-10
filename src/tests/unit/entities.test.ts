import { Order } from "../../domain/entities";
import { DiscountCode } from "../../domain/models";
import { Address, Id, OrderLine, PositiveNumber } from "../../domain/valueObjects";

describe("Entity tests", () => {
    it('creates a new order', async () => {

        const order: Order = createValidOrder();
        expect(order).toBeInstanceOf(Order);
        expect(order.status).toBe("PENDING");
        expect(order.orderLines.length).toBe(1);
        expect(order.orderLines[0].quantity.value).toBe(1);
        expect(order.orderLines[0].price.value).toBe(100);
        expect(order.orderLines[0].calculateSubtotal().value).toBe(100);
        expect(order.shippingAddress.value).toBe("123 Main St, Springfield, IL, 62701, USA");
        expect(order.discountCode).toBeUndefined();
        
    });
    it('creates a new order with discount', async () => {
        const discount = 'DISCOUNT20';
        const order: Order = createValidOrder(discount);
        expect(order.discountCode).toBe(discount);
        expect(order.calculateTotal().value).toBe(80);
        
        }
    );    
});

function createValidOrder(discount?: DiscountCode): Order {
    const id = Id.create();
    const address = Address.create("123 Main St, Springfield, IL, 62701, USA");
    const orderLine1 = OrderLine.create(
        Id.create(),
        PositiveNumber.create(1),
        PositiveNumber.create(100)
    );
    return Order.create(id, address, [orderLine1], discount);
}
