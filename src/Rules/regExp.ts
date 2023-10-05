import Rule, { RuleFun } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
import ValueNOTtheSame from "./Messages/ValuesNotSame";
import { isString } from "@/utils/types";
export const _regExp = /^regex:\/(.+)\/(\w*)$/gi;
function regExp<Data>(
    ...arr: Parameters<RuleFun<Data>>
): ReturnType<RuleFun<Data>> {
    const [value, name, , , lang] = arr;
    const match = _regExp.exec(name);
    if (!match) return "undefined regular expression";
    if (!isString(value)) return handelMessage(ValueNOTtheSame[lang], ...arr);
    const [, regEx, iden] = match;
    const res = new RegExp(regEx, iden).test(value);
    if (!res) return handelMessage(ValueNOTtheSame[lang], ...arr);
}
export default new Rule<`regExp:${string}`, string>(_regExp, regExp);
