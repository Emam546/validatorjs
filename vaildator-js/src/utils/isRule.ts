import { isArray, isString } from "./types";
export function is_Rule(array: any): boolean {
    return (
        array != null &&
        isArray(array) && array instanceof Array &&
        !array.some((v) => {
            return !isString(v);
        })
    );
}