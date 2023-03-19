/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { isArray } from "./types";

export function getAllValues(
    inputs: unknown,
    path: string,
    addedPath = ""
): Record<string, unknown> {
    if (!path.length) return { [addedPath.slice(0, -1)]: inputs };
    const paths = path.split(".");
    let currObj: any = inputs;
    for (let i = 0; i < paths.length; i++) {
        const key = paths[i];
        if (key.startsWith("*")) {
            const oldPath = paths.slice(0, i).join(".");
            const returnedPath = paths.slice(i + 1).join(".");
            let allValues: Record<string, unknown> = {};
            const semi = isArray(currObj) ? "*" : "";
            for (const key in currObj)
                allValues = {
                    ...allValues,
                    ...getAllValues(
                        currObj[key],
                        returnedPath,
                        `${addedPath}${oldPath}.${semi}${key}.`
                    ),
                };

            return allValues;
        } else currObj = currObj[key];
        if (currObj === undefined) return {};
    }
    return { [`${addedPath}${path}`]: currObj };
}
export function getValue(inputs: unknown, path: string) {
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
    return currObj as unknown;
}
