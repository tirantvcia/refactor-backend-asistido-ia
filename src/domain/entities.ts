import { DomainError } from "./error";
import { DiscountCode } from "./models";
import { Address, Id, OrderLine, PositiveNumber } from "./valueObjects";

export class Order {
    calculateTotal() {
       const orderLinesTotal = this.orderLines.reduce((total, line) => {
            return total.sum(line.calculateSubtotal().value);
        }, PositiveNumber.create(0));

        if (this.discountCode === 'DISCOUNT20') {
            return orderLinesTotal.multiply(PositiveNumber.create(0.8));
        }
        return orderLinesTotal;
    }
    
    public static create(id: Id,       
        shippingAddress: Address,
        orderLines: Array<OrderLine>,
        discountCode?: DiscountCode): Order {
        if (!orderLines || orderLines.length === 0) {
            throw new DomainError("The order must have at least one item");
        }
        const status = "PENDING";
        return new Order(id, status, orderLines, discountCode, shippingAddress);
    }
    private constructor(
        readonly id: Id,
        readonly status: string,
        readonly orderLines: Array<OrderLine>,
        readonly discountCode: DiscountCode | undefined,
        readonly shippingAddress: Address
    ) {
    }
}