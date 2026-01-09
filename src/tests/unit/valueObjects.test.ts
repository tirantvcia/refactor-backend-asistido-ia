import { Address, Id, PositiveNumber } from "../../domain/valueObjects";

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
