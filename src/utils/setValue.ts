/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { isArray } from "./types";

export function setAllValues(
    inputs: unknown,
    path: string,
    value: unknown
): boolean[] {
    if (!path.length) return [false];
    const keys = path.split(".");
    let currObj: any = inputs;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (key.startsWith("*")) {
            const returnedPath = keys.slice(i + 1).join(".");
            const allValues: ReturnType<typeof setAllValues> = [];
            for (const i in currObj) {
                allValues.push(
                    ...setAllValues(currObj[i], returnedPath, value)
                );
            }

            return allValues;
        } else currObj = currObj[key];
        if (currObj === undefined) return [false];
    }
    const key = keys.at(-1);
    if (key === undefined) return [false];
    if (key.startsWith("*")) {
        for (const key in currObj) currObj[key] = value;
    } else currObj[key] = value;
    return [true];
}
export function setValue(
    inputs: unknown,
    path: string,
    value: unknown
): boolean {
    const keys = path.split(".");
    let currObj: any = inputs;
    for (let i = 0; i < keys.length - 1 && currObj != undefined; i++) {
        const key = keys[i];
        if (key.startsWith("*") && isArray(currObj)) {
            const index = parseInt(key.slice(1));
            if (!isNaN(index)) {
                currObj = currObj[index];
                if (currObj != undefined) continue;
            }
        } else currObj = currObj[key];
    }
    if (currObj === undefined) return false;
    const key = keys.at(-1);
    if (key === undefined) return false;
    if (key.startsWith("*")) {
        const index = parseInt(key.slice(1));
        if (isNaN(index)) return false;
        currObj[index] = value;
    } else currObj[key] = value;

    return true;
}
