import { isArray, isNumber, isObject, isString } from "./types";

export default function (value: unknown): boolean {
    if (value === undefined) return true;
    if (value === null) return true;
    if (isString(value) || isArray(value)) return value.length == 0;
    if (isNumber(value)) return false;
    if (value instanceof Map && value instanceof Set) return value.size == 0;
    if (isObject(value)) return Object.keys(value).length == 0;
    return false;
}
