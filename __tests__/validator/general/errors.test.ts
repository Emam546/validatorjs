import Validator, { LangTypes } from "@/index";

describe("Test Errors option validator", () => {
    test("test Error Merging", () => {
        const customMessage = "my own message";
        const validator = new Validator("string", {
            errors: { string: { en: customMessage } },
        });
        expect(validator.errors.string.en).toBe(customMessage);
        expect(validator.getErrors(1234)).toStrictEqual({
            ".": [{ message: customMessage, value: 1234 }],
        });
        expect(validator.validate(1234, "string")).toStrictEqual({
            message: customMessage,
            value: 1234,
        });
    });
    test("test Invalid Path errors Merging", () => {
        const customMessage = "my own message";
        const validator = new Validator(
            { correctPath: "string" },
            {
                errors: { invalidPath: { en: customMessage } },
            }
        );
        expect(validator.errors.invalidPath.en).toBe(customMessage);
        expect(validator.getErrors({ wrongPath: 1234 })).toStrictEqual({
            wrongPath: [{ message: customMessage, value: 1234 }],
        });
    });
    test("test unMatchedType Path errors Merging", () => {
        const customMessage = "my own message";
        const validator = new Validator(
            { correctPath: [["string"], "array"] },
            {
                errors: { unMatchedType: { en: customMessage } },
            }
        );
        expect(validator.errors.unMatchedType.en).toBe(customMessage);
        expect(
            validator.getErrors({ correctPath: { wrongType: 1234 } })
        ).toStrictEqual({
            correctPath: [
                { message: customMessage, value: { wrongType: 1234 } },
            ],
        });
    });
    test("test adding a new Language to the errors", () => {
        const customMessage = "my custom france message message";
        const newLang: LangTypes = "fr";
        const validator = new Validator("string", {
            errors: { string: { [newLang]: customMessage } },
        });
        expect(validator.errors.string[newLang]).toBe(customMessage);
        expect(validator.getErrors(1234, newLang)).toStrictEqual({
            ".": [{ message: customMessage, value: 1234 }],
        });
    });
});
