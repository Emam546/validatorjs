import { AllRules } from "@/Rules";
describe("test Regular Expression of Validators", () => {
    test("string", () => {
        expect(AllRules.string.isequal("string")).toBe(true);
        expect(AllRules.int.isequal("integer")).toBe(true);
    });
    test("min", () => {
        expect(AllRules.min.isequal("min")).toBe(true);
        expect(AllRules.min.isequal("min:10")).toBe(true);
        expect(AllRules.min.isequal("mi")).toBe(false);
        expect(AllRules.min.isequal("min:")).toBe(false);
        expect(AllRules.min.isequal("min:10:10")).toBe(false);
        expect(AllRules.min.isequal(" min")).toBe(false);
        expect(AllRules.min.isequal("min ")).toBe(false);
        expect(AllRules.min.isequal("min:s")).toBe(false);
        expect(AllRules.min.isequal("min:*")).toBe(false);
    });
    test("limit", () => {
        expect(AllRules.limit.isequal("limit:10:20")).toBe(true);
        expect(AllRules.limit.isequal("limit:10:-20")).toBe(true);
        expect(AllRules.limit.isequal("limit:-10:20")).toBe(true);
        expect(AllRules.limit.isequal("limit:-10:-20")).toBe(true);
        expect(AllRules.limit.isequal("limit:10")).toBe(false);
        expect(AllRules.limit.isequal("limit::30")).toBe(false);
        expect(AllRules.limit.isequal("limit")).toBe(false);
        expect(AllRules.limit.isequal(" limit:10:20")).toBe(false);
        expect(AllRules.limit.isequal("limit:10:20 ")).toBe(false);
        expect(AllRules.limit.isequal("l:12:20")).toBe(false);
    });
    test("different", () => {
        expect(AllRules.different.isequal("different:myPath")).toBe(true);
        expect(AllRules.different.isequal("different")).toBe(false);
        expect(AllRules.different.isequal("different:")).toBe(false);
        expect(AllRules.different.isequal("different")).toBe(false);
        expect(AllRules.different.isequal(" different:myPath")).toBe(false);
        expect(AllRules.different.isequal("d:myPath")).toBe(false);
    });
    test("in", () => {
        expect(AllRules._in.isequal("in:foo,bar")).toBe(true);
        expect(AllRules._in.isequal("in:foo")).toBe(true);
        expect(AllRules._in.isequal("in:")).toBe(false);
        expect(AllRules._in.isequal("in")).toBe(false);
        expect(AllRules._in.isequal(" in:myPath")).toBe(false);
        expect(AllRules._in.isequal("i:myPath")).toBe(false);
    });
    test("not in", () => {
        expect(AllRules.notIn.isequal("not_in:foo,bar")).toBe(true);
        expect(AllRules.notIn.isequal("not_in:foo")).toBe(true);
        expect(AllRules.notIn.isequal("not_in:")).toBe(false);
        expect(AllRules.notIn.isequal("not_in")).toBe(false);
        expect(AllRules.notIn.isequal(" not_in:myPath")).toBe(false);
        expect(AllRules.notIn.isequal("n:myPath")).toBe(false);
    });

    test("require if", () => {
        expect(
            AllRules.require_without.isequal("required_without:foo,bar")
        ).toBe(true);
        expect(AllRules.require_without.isequal("required_without:foo")).toBe(
            true
        );
        expect(AllRules.require_without.isequal("required_without:foo,")).toBe(
            true
        );
        expect(AllRules.require_without.isequal("required_without:")).toBe(
            false
        );
        expect(AllRules.require_without.isequal("required_without")).toBe(
            false
        );
        expect(
            AllRules.require_without.isequal(" required_without:myPath,value")
        ).toBe(false);
        expect(AllRules.require_without.isequal("r:myPath,value")).toBe(false);
    });
    test("regExp", () => {
        expect(AllRules.regExp.isequal("regex:/myXp/ig")).toBe(true);
        expect(AllRules.regExp.isequal("regex:/myReg/")).toBe(true);
        expect(AllRules.regExp.isequal("regex://ig")).toBe(false);
        expect(AllRules.regExp.isequal("regex:")).toBe(false);
        expect(AllRules.regExp.isequal(" regex:/myXp/ig")).toBe(false);
        expect(AllRules.regExp.isequal("regex:/myXp/ig ")).toBe(false);
    });
});
