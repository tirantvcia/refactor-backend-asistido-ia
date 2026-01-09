import { Address, Id, OrderLine, PositiveNumber } from "../../domain/valueObjects";

describe("A positive number value object", () => {
    it("should create a positive number successfully", () => {
        const positiveNumber = PositiveNumber.create(10);
        expect(positiveNumber.value).toBe(10);
    });
    it("should not create a positive number with negative value", () => {
        expect(() => PositiveNumber.create(-5)).toThrowError("Value must be positive");
    });
});
describe("An address value object", () => {
    // Additional tests for Address value object can be added here
    it("should create a valid address successfully", () => {
        const anAddress = Address.create("123 Main St, Springfield, IL, 62701, USA");
        expect(anAddress.value).toBe("123 Main St, Springfield, IL, 62701, USA");
    })
    it("should not create an empty address", () => {
        expect(() => Address.create("")).toThrowError("Address cannot be empty");
        expect(() => Address.create("   ")).toThrowError("Address cannot be empty");
    });
});

describe("An ID value object", () => {
    // Additional tests for Id value object can be added here
    it("should create a valid ID successfully", () => {
        const anId = Id.create();
        const otherId = Id.create();
        expect(anId.value).not.toBe(otherId.value);
    })
});

describe("An order line value object", () => {
    // Additional tests for OrderLine value object can be added here
    it("should create a valid order line successfully", () => {
        const anId = Id.create();
        const quantity = PositiveNumber.create(2);
        const price = PositiveNumber.create(50);
        const orderLine = OrderLine.create(anId, quantity, price);
        expect(orderLine.id).toBe(anId);
        expect(orderLine.quantity).toBe(quantity);
        expect(orderLine.price).toBe(price);
    });
    it("should calculate the total correctly", () => {
        const anId = Id.create();
        const quantity = PositiveNumber.create(3);
        const price = PositiveNumber.create(20);
        const orderLine = OrderLine.create(anId, quantity, price);
        const subtotal = orderLine.calculateSubtotal();
        expect(subtotal.value).toEqual(60);
    });
});
