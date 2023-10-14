import Rule, { MessagesStore } from "@/Rule";
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
export const isDate = new Rule(
    "isDate",
    function isDateFn(value, data, path, input, lang, errors) {
        if (!isValidDate(value))
            return handelMessage(errors[lang], value, data, path, input, lang);
    },
    NotValidDate
);

export const date = new Rule<
    { date: Date; diff?: number },
    {
        errors: MessagesStore<{ date: Date; diff?: number }>;
        notValidate: MessagesStore<{ date: Date; diff?: number }>;
    }
>(
    (val): val is { date: Date; diff?: number } => {
        return hasOwnProperty(val, "date") && val["date"] instanceof Date;
    },
    function equal(value, data, path, input, lang, errors) {
        if (!isValidDate(value))
            return handelMessage(
                errors.notValidate[lang],
                value,
                data,
                path,
                input,
                lang
            );
        if (
            Math.abs(data.date.getTime() - getTime(value).getTime()) >
            (data.diff || 1000)
        )
            return handelMessage(
                errors.errors[lang],
                value,
                data,
                path,
                input,
                lang
            );
    },
    { notValidate: NotValidDate, errors: Equal }
);
export const after = new Rule<
    { after: Date },
    {
        errors: MessagesStore<{ after: Date }>;
        notValidate: MessagesStore<{ after: Date }>;
    }
>(
    (val): val is { after: Date } => {
        return hasOwnProperty(val, "after") && val["after"] instanceof Date;
    },
    function afterfn(value, data, path, input, lang, errors) {
        if (!isValidDate(value))
            return handelMessage(
                errors.notValidate[lang],
                value,
                data,
                path,
                input,
                lang
            );
        if (data.after > getTime(value))
            return handelMessage(
                errors.errors[lang],
                value,
                data,
                path,
                input,
                lang
            );
    },
    { notValidate: NotValidDate, errors: After }
);
export const before = new Rule<
    { before: Date },
    {
        errors: MessagesStore<{ before: Date }>;
        notValidate: MessagesStore<{ before: Date }>;
    }
>(
    (val: unknown): val is { before: Date } => {
        return hasOwnProperty(val, "before") && val["before"] instanceof Date;
    },
    function beforefn(value, data, path, input, lang, errors) {
        if (!isValidDate(value))
            return handelMessage(
                errors.notValidate[lang],
                value,
                data,
                path,
                input,
                lang
            );
        if (data.before < getTime(value))
            return handelMessage(
                errors.errors[lang],
                value,
                data,
                path,
                input,
                lang
            );
    },
    { notValidate: NotValidDate, errors: Before }
);
