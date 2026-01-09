import { v4 as uuid } from "uuid";
import { DomainError } from "./error";


export class PositiveNumber {
    public multiply(number: PositiveNumber): PositiveNumber {
        return PositiveNumber.create(this.value * number.value);
    }

    static create(value: number): PositiveNumber {
        if (value < 0) {
            throw new DomainError("Value must be positive");
        }

        return new PositiveNumber(value);
    }
    private constructor(readonly value: number) {
    }
}
export class Address {
    static create(value: string): Address {
        if (!value || value.trim().length === 0) {
            throw new DomainError("Address cannot be empty");
        }
        return new Address(value);
    }
    private constructor(readonly value: string) {
    }
}

export class Id {
    static create(): Id {
        return new Id(uuid());
    }
    private constructor(readonly value: string) {
    }
}

export class OrderLine {
    static create(id: Id, quantity: PositiveNumber, price: PositiveNumber): OrderLine {
        return new OrderLine(id, quantity, price);
    }
    private constructor(
        readonly id: Id,
        readonly quantity: PositiveNumber,
        readonly price: PositiveNumber
    ) {
    }   

    public calculateSubtotal(): PositiveNumber {
        return this.price.multiply(this.quantity);
    }
}



