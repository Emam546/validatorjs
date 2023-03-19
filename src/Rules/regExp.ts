import Rule, { RuleFun } from "../Rule";
import handelMessage from "../utils/handelMessage";
import ValueNOTtheSame from "./Messages/ValuesNotSame";
export const _regExp = /^regex:\/(.+)\/(\w*)$/gi;
function regExp(...arr: Parameters<RuleFun<unknown,string>>): ReturnType<RuleFun<unknown,string>> {
    const [value, name, , , lang] = arr;
    const match = _regExp.exec(name);
    if (!match) return "undefined regular expression";
    const [, regEx, iden] = match;
    const res = new RegExp(regEx, iden).test(value);
    if (!res) return handelMessage(ValueNOTtheSame[lang], ...arr);
}
export default new Rule(_regExp, regExp);
