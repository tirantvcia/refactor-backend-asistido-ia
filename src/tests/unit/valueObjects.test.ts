class PositiveNumber {

    static create(value: number): PositiveNumber {
        if (value < 0) {
            throw new Error("Value must be positive");
        }

        return new PositiveNumber(value);
    }
    private constructor(readonly value: number) {
    }
}

describe("A positive number value object", () => {
    it("should create a positive number successfully", () => {
        const positiveNumber = PositiveNumber.create(10);
        expect(positiveNumber.value).toBe(10);
    });
    it("should not create a positive number with negative value", () => {
        expect(() => PositiveNumber.create(-5)).toThrowError("Value must be positive");
    });
});