import { DomainError } from "./error";

export class PositiveNumber {

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

