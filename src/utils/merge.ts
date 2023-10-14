import { ObjectEntries } from ".";
import { hasOwnProperty } from "./compare";
import { isArray } from "./types";
function isObject<T>(
    value: unknown
): value is Record<string | number, T> | Array<T> {
    return typeof value === "object" && value !== null;
}
export default function mergeObjects<T>(...objs: unknown[]): T {
    return objs.reduce((acc, val) => {
        if (!isObject(acc)) return val;
        if (!isObject(val)) return acc;
        if (isArray(val))
            return val.reduce<Array<unknown>>((arr, val, key) => {
                if (!hasOwnProperty(acc, key)) return [...arr, val];
                return [...arr, mergeObjects(acc[key], val)];
            }, []);
        return ObjectEntries(val).reduce<object>((acc, [key, val]) => {
            if (!hasOwnProperty(acc, key)) {
                return { ...acc, [key]: val };
            }
            return { ...acc, [key]: mergeObjects(acc[key], val) };
        }, acc);
    }, objs[0]) as T;
}
