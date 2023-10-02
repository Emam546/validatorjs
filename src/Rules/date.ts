import Rule, { MessagesStore, RuleFun } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
import isEmpty from "@/utils/isEmpty";
import { isNumber, isString } from "@/utils/types";
export const NotValidDate: MessagesStore<unknown> = {
    en: "THE DATE IS NOT VALID",
};
export const After: MessagesStore<unknown> = {
    en: (_, name) =>
        `The Date is before ${getTimeName(name).toUTCString()} date`,
};
export const Before: MessagesStore<unknown> = {
    en: (_, name) =>
        `The Date is after ${getTimeName(name).toUTCString()} date`,
};
export const Equal: MessagesStore<unknown> = {
    en: (_, name) =>
        `The Date is not equal ${getTimeName(name).toUTCString()} date`,
};
function _getDateName(name: string): string {
    const regExp = /^\w+:(.+)/gi;
    const res = regExp.exec(name);
    if (!res) return "";
    return res[1];
}
function isValidDate(dateString: unknown): boolean {
    return getTime(dateString).toString() !== "Invalid Date";
}
function getTime(dateString: unknown): Date {
    if (dateString instanceof Date) return dateString;
    if (isEmpty(dateString)) return new Date("Invalid Date");
    if (
        isString(dateString) &&
        /(^\d+)$/.test(dateString) &&
        !isNaN(parseInt(dateString))
    ) {
        return new Date(parseInt(dateString));
    } else if (isNumber(dateString)) return new Date(dateString);
    throw new Error("undefined type");
}
function getTimeName(name: string): Date {
    const dateName = _getDateName(name);
    if (dateName.startsWith("now")) {
        if (isNaN(parseInt(dateName.slice(4)))) return new Date(Date.now());
        let num = Date.now();
        const inNum = parseInt(dateName.slice(4));
        switch (dateName.at(3)) {
            case "+":
                num += inNum;
                break;
            case "-":
                num -= inNum;
        }
        return new Date(num);
    } else {
        if (!isValidDate(dateName))
            throw new Error(`THE DATE ${dateName} IS NOT VALID`);
        return getTime(dateName);
    }
}
function isDateFn<Input, Data>(...arr: Parameters<RuleFun<Input, Data>>) {
    const [value, , , , lang] = arr;
    if (!isValidDate(value)) return handelMessage(NotValidDate[lang], ...arr);
}
function afterfn<Input, Data>(
    ...arr: Parameters<RuleFun<Input, Data>>
): ReturnType<RuleFun<Input, Data>> {
    const [dateV, name, , , lang] = arr;
    if (!isValidDate(dateV)) return handelMessage(NotValidDate[lang], ...arr);
    if (getTimeName(name) > getTime(dateV))
        return handelMessage(After[lang], ...arr);
}
function beforefn<Input, Data>(
    ...arr: Parameters<RuleFun<Input, Data>>
): ReturnType<RuleFun<Input, Data>> {
    const [value, name, , , lang] = arr;
    if (!isValidDate(value)) return handelMessage(NotValidDate[lang], ...arr);
    if (getTimeName(name) < getTime(value))
        return handelMessage(Before[lang], ...arr);
}
function equal<Input, Data>(
    ...arr: Parameters<RuleFun<Input, Data>>
): ReturnType<RuleFun<Input, Data>> {
    const [value, name, , , lang] = arr;
    if (!isValidDate(value)) return handelMessage(NotValidDate[lang], ...arr);
    if (Math.abs(getTimeName(name).getTime() - getTime(value).getTime()) > 1000)
        return handelMessage(Before[lang], ...arr);
}
export const isDate = new Rule("isDate", isDateFn);
export const date = new Rule(/(^date:)/, equal);
export const after = new Rule(/(^after:)/, afterfn);
export const before = new Rule(/(^before:)/, beforefn);
