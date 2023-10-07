import Rule, { MessagesStore, RuleFun } from "@/Rule";
import { hasOwnProperty } from "@/utils/compare";
import handelMessage from "@/utils/handelMessage";
import isEmpty from "@/utils/isEmpty";
import { isNumber, isString } from "@/utils/types";

export const NotValidDate: MessagesStore<unknown> = {
    en: "THE DATE IS NOT VALID",
};
export const After: MessagesStore<{ after: Date }> = {
    en: (_, data) => `The Date is before ${data.after.toUTCString()} date`,
};
export const Before: MessagesStore<{ before: Date }> = {
    en: (_, data) => `The Date is after ${data.before.toUTCString()} date`,
};
export const Equal: MessagesStore<{ date: Date }> = {
    en: (_, data) => `The Date is not equal ${data.date.toUTCString()} date`,
};

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
export const isDate = new Rule("isDate", function isDateFn(...arr) {
    const [value, , , lang] = arr;
    if (!isValidDate(value)) return handelMessage(NotValidDate[lang], ...arr);
});

export const date = new Rule<{ date: Date; diff?: number }>(
    (val): val is { date: Date; diff?: number } => {
        return hasOwnProperty(val, "date") && val["date"] instanceof Date;
    },
    function equal(...arr) {
        const [value, data, , lang] = arr;
        if (!isValidDate(value))
            return handelMessage(NotValidDate[lang], ...arr);
        if (
            Math.abs(data.date.getTime() - getTime(value).getTime()) >
            (data.diff || 1000)
        )
            return handelMessage(Equal[lang], ...arr);
    }
);
export const after = new Rule<{ after: Date }>(
    (val): val is { after: Date } => {
        return hasOwnProperty(val, "after") && val["after"] instanceof Date;
    },
    function afterfn(...arr) {
        const [value, data, , lang] = arr;
        if (!isValidDate(value))
            return handelMessage(NotValidDate[lang], ...arr);
        if (data.after > getTime(value))
            return handelMessage(After[lang], ...arr);
    }
);
export const before = new Rule<{ before: Date }>(
    (val: unknown): val is { before: Date } => {
        return hasOwnProperty(val, "before") && val["before"] instanceof Date;
    },
    function beforefn(...arr) {
        const [value, data, , lang] = arr;
        if (!isValidDate(value))
            return handelMessage(NotValidDate[lang], ...arr);
        if (data.before < getTime(value))
            return handelMessage(Before[lang], ...arr);
    }
);
