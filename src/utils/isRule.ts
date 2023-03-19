import {  RulesGetter } from "../main";
import { isArray, isString } from "./types";
export function is_Rule(array: unknown): array is RulesGetter {
    return (
        array != null &&
        isArray(array) && array instanceof Array &&
        !array.some((v) => {
            return !isString(v);
        })
    );
}