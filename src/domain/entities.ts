import { DomainError } from "./error";
import { DiscountCode, OrderStatus } from "./models";
import { Address, Id, OrderLine, PositiveNumber } from "./valueObjects";

type OrderDto = {
    id: string;
    shippingAddress: string;
    thisLines: {
        id: string;
        quantity: number;
        price: number;
    }[];
    discountCode: "DISCOUNT20" | undefined;
    status: any;
};

export class Order {



    static fromDto(dto: OrderDto) {
        if (!dto.thisLines || dto.thisLines.length === 0) {
            throw new DomainError("The order must have at least one item");
        }
        const status = dto.status;
        const shippingAddress = Address.create(dto.shippingAddress);
        const orderLines = dto.thisLines.map(ol => OrderLine.create(
            Id.from(ol.id),
            PositiveNumber.create(ol.quantity),
            PositiveNumber.create(ol.price)
        ));
        const discountCode = dto.discountCode;  
        const id = Id.from(dto.id);
        return new Order(id, status, orderLines, discountCode, shippingAddress);
    }

    public static create(      
        shippingAddress: Address,
        orderLines: Array<OrderLine>,
        discountCode?: DiscountCode): Order {
        if (!orderLines || orderLines.length === 0) {
            throw new DomainError("The order must have at least one item");
        }
        const status = OrderStatus.CREATED;
        const id = Id.create();
        return new Order(id, status, orderLines, discountCode, shippingAddress);
    }
    private constructor(
        readonly id: Id,
        private status: string,
        readonly orderLines: Array<OrderLine>,
        readonly discountCode: DiscountCode | undefined,
        readonly shippingAddress: Address
    ) {
    }

    toDto() {
        return {
            id: this.id.value,
            shippingAddress: this.shippingAddress.value,
            thisLines: this.orderLines.map(ol => ({
                id: ol.id.value,
                quantity: ol.quantity.value,
                price: ol.price.value
            })),
            discountCode: this.discountCode,
            status: this.getStatus()
        };
    }

    isCreated(): boolean {
        return this.status === OrderStatus.CREATED;
    }
    isCompleted(): boolean {
        return this.status === OrderStatus.COMPLETED;
    }
    completeOrder()  {
        if (!this.isCreated()) {
            throw new DomainError(`Cannot complete an order with status: ${this.status}`);
        }   
        this.status = OrderStatus.COMPLETED;
    }

    calculateTotal() {
       const orderLinesTotal = this.orderLines.reduce((total, line) => {
            return total.sum(line.calculateSubtotal());
        }, PositiveNumber.create(0));

        return this.applyDiscount(orderLinesTotal);
    }
    
    applyDiscount(orderLinesTotal: PositiveNumber) {
        if (this.discountCode === 'DISCOUNT20') {
            return orderLinesTotal.multiply(PositiveNumber.create(0.8));
        }
        return orderLinesTotal;
    }
    
    getStatus(): any {
        return this.status;
    }   
 
}