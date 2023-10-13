import { AllRules } from "@/Rules";
describe("test is equal validator", () => {
    test("string", () => {
        expect(AllRules.string.isequal("string")).toBe(true);
        expect(AllRules.int.isequal("integer")).toBe(true);
    });
    test("min", () => {
        expect(AllRules.min.isequal({ min: 0 })).toBe(true);
        expect(AllRules.min.isequal({ min: 10 })).toBe(true);
        expect(AllRules.min.isequal({ mi: 10 })).toBe(false);
        expect(AllRules.min.isequal({ min: "" })).toBe(false);
        expect(AllRules.min.isequal({ min: null })).toBe(false);
        expect(AllRules.min.isequal({ min: "s" })).toBe(false);
        expect(AllRules.min.isequal({ min: "20" })).toBe(false);
    });

    test("different", () => {
        expect(AllRules.different.isequal({ different: "myPath" })).toBe(true);
        expect(AllRules.different.isequal("different")).toBe(false);
        expect(AllRules.different.isequal({ different: null })).toBe(false);
        expect(AllRules.different.isequal({ " different": "myPath" })).toBe(
            false
        );
        expect(AllRules.different.isequal({ d: "myPath" })).toBe(false);
    });
    test("in", () => {
        expect(AllRules._in.isequal({ in: ["foo", "bar"] })).toBe(true);
        expect(AllRules._in.isequal({ in: ["foo"] })).toBe(true);
        expect(AllRules._in.isequal({ in: null })).toBe(false);
        expect(AllRules._in.isequal("in")).toBe(false);
        expect(AllRules._in.isequal({ in: "mypath" })).toBe(false);
        expect(AllRules._in.isequal({ i: ["mypath"] })).toBe(false);
    });
    test("not in", () => {
        expect(AllRules.notIn.isequal({ not_in: ["foo", "bar"] })).toBe(true);
        expect(AllRules.notIn.isequal({ not_in: ["foo"] })).toBe(true);
        expect(AllRules.notIn.isequal({ not_in: null })).toBe(false);
        expect(AllRules.notIn.isequal("not_in")).toBe(false);
        expect(AllRules.notIn.isequal({ not_in: "mypath" })).toBe(false);
        expect(AllRules.notIn.isequal({ not_i: ["mypath"] })).toBe(false);
    });

    test("require required_without", () => {
        expect(
            AllRules.require_without.isequal({
                required_without: ["foo", "bar"],
            })
        ).toBe(true);
        expect(
            AllRules.require_without.isequal({
                required_without: ["foo"],
            })
        ).toBe(true);
        expect(
            AllRules.require_without.isequal({
                required_without: null,
            })
        ).toBe(false);
    });
    test("regExp", () => {
        expect(AllRules.regExp.isequal({ regex: /myXp/gi })).toBe(true);
        expect(AllRules.regExp.isequal({ regex: /myReg/ })).toBe(true);
        expect(AllRules.regExp.isequal({ regex: "//ig" })).toBe(false);
        expect(AllRules.regExp.isequal({ regex: "" })).toBe(false);
        expect(AllRules.regExp.isequal({ " regex": /myXp/gi })).toBe(false);
    });
});
