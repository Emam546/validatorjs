import { isNumber, isNumeric } from "./types";

export function getAllValues(inputs: any, path: string): any[] {
    if (!path.length) return [inputs];
    const keys = path.split(".");
    let currObj = inputs;
    for (let i = 0; i < keys.length && currObj != undefined; i++) {
        const key = keys[i];
        if (key.startsWith("*")) {
            const returnedPath = keys.slice(i + 1).join(".");
            let allValues: any[] = [];
            for (const key in currObj)
                allValues = [
                    ...allValues,
                    ...getAllValues(currObj[key], returnedPath),
                ];

            return allValues;
        } else currObj = currObj[key];
    }

    return [currObj];
}
export function getValue(inputs: any, path: string) {
    const keys = path.split(".");
    let currObj: any = inputs;
    for (let i = 0; i < keys.length && currObj != undefined; i++) {
        const key = keys[i];
        if (key.startsWith("*")) {
            const index = parseInt(key.slice(1));
            if (!isNaN(index)) {
                currObj = currObj[index];
                if (currObj != undefined) continue;
            }
        } else currObj = currObj[key];
    }
    return currObj;
}
