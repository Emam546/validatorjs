import * as r from "../src/Rules";
describe("test Regular Expression of Validators", () => {
    test("string", () => {
        expect(r.string.isequal("string")).toBe(true);
        expect(r.int.isequal("integer")).toBe(true);
    });
    test("min", () => {
        expect(r.min.isequal("min")).toBe(true);
        expect(r.min.isequal("min:10")).toBe(true);
        expect(r.min.isequal("mi")).toBe(false);
        expect(r.min.isequal("min:")).toBe(false);
        expect(r.min.isequal("min:10:10")).toBe(false);
        expect(r.min.isequal(" min")).toBe(false);
        expect(r.min.isequal("min ")).toBe(false);
        expect(r.min.isequal("min:s")).toBe(false);
        expect(r.min.isequal("min:*")).toBe(false);
    });
    test("limit", () => {
        expect(r.limit.isequal("limit:10:20")).toBe(true);
        expect(r.limit.isequal("limit:10")).toBe(false);
        expect(r.limit.isequal("limit::30")).toBe(false);
        expect(r.limit.isequal("limit")).toBe(false);
        expect(r.limit.isequal(" limit:10:20")).toBe(false);
        expect(r.limit.isequal("limit:10:20 ")).toBe(false);
        expect(r.limit.isequal("l:12:20")).toBe(false);
    });
    test("different", () => {
        expect(r.different.isequal("different:myPath")).toBe(true);
        expect(r.different.isequal("different")).toBe(false);
        expect(r.different.isequal("different:")).toBe(false);
        expect(r.different.isequal("different")).toBe(false);
        expect(r.different.isequal(" different:myPath")).toBe(false);
        expect(r.different.isequal("d:myPath")).toBe(false);
    });
    test("in", () => {
        expect(r._in.isequal("in:foo,bar")).toBe(true);
        expect(r._in.isequal("in:foo")).toBe(true);
        expect(r._in.isequal("in:")).toBe(false);
        expect(r._in.isequal("in")).toBe(false);
        expect(r._in.isequal(" in:myPath")).toBe(false);
        expect(r._in.isequal("i:myPath")).toBe(false);
    });
    test("not in", () => {
        expect(r.notIn.isequal("not_in:foo,bar")).toBe(true);
        expect(r.notIn.isequal("not_in:foo")).toBe(true);
        expect(r.notIn.isequal("not_in:")).toBe(false);
        expect(r.notIn.isequal("not_in")).toBe(false);
        expect(r.notIn.isequal(" not_in:myPath")).toBe(false);
        expect(r.notIn.isequal("n:myPath")).toBe(false);
    });
    test("require if", () => {
        expect(r.require_if.isequal("required_if:foo,bar")).toBe(true);
        expect(r.require_if.isequal("required_if:foo,")).toBe(false);
        expect(r.require_if.isequal("required_if:foo")).toBe(false);
        expect(r.require_if.isequal("required_if:")).toBe(false);
        expect(r.require_if.isequal("required_if")).toBe(false);
        expect(r.require_if.isequal(" required_if:myPat,value")).toBe(false);
        expect(r.require_if.isequal("r:myPath,value")).toBe(false);
    });
    test("require if", () => {
        expect(r.require_if.isequal("required_if:foo,bar")).toBe(true);
        expect(r.require_if.isequal("required_if:foo,")).toBe(false);
        expect(r.require_if.isequal("required_if:foo")).toBe(false);
        expect(r.require_if.isequal("required_if:")).toBe(false);
        expect(r.require_if.isequal("required_if")).toBe(false);
        expect(r.require_if.isequal(" required_if:myPat,value")).toBe(false);
        expect(r.require_if.isequal("r:myPath,value")).toBe(false);
    });
    test("require if", () => {
        expect(r.require_without.isequal("required_without:foo,bar")).toBe(
            true
        );
        expect(r.require_without.isequal("required_without:foo")).toBe(true);
        expect(r.require_without.isequal("required_without:foo,")).toBe(true);
        expect(r.require_without.isequal("required_without:")).toBe(false);
        expect(r.require_without.isequal("required_without")).toBe(false);
        expect(r.require_without.isequal(" required_without:myPat,value")).toBe(
            false
        );
        expect(r.require_without.isequal("r:myPath,value")).toBe(false);
    });
    test("regExp", () => {
        expect(r.regExp.isequal("regex:/myXp/ig")).toBe(true);
        expect(r.regExp.isequal("regex:/myReg/")).toBe(true);
        expect(r.regExp.isequal("regex://ig")).toBe(false);
        expect(r.regExp.isequal("regex:")).toBe(false);
        expect(r.regExp.isequal(" regex:/myXp/ig")).toBe(false);
        expect(r.regExp.isequal("regex:/myXp/ig ")).toBe(false);
    });
});
