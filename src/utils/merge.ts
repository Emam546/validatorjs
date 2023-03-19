/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { hasOwnProperty } from "./compare";
import { isArray, isNumber, isString } from "./types";
function filterObj(obj: unknown): obj is Record<string, unknown> {
    return (
        !(
            isString(obj) &&
            isNumber(obj) &&
            typeof obj == "boolean" &&
            typeof obj == "undefined"
        ) && obj instanceof Object
    );
}
export default function mergeObjects(...objs: any[]) {
    objs = objs.filter((obj) => obj != undefined);
    if (!objs.length) return;
    const newObjs = objs.filter(filterObj);
    if (!newObjs.length) return objs.at(-1);
    objs = newObjs;
    if (objs.length == 1) return objs[0];
    const allKeys = objs.reduce((acc, cObj) => {
        return { ...acc, ...cObj };
    }, {});
    for (const objKey in allKeys) {
        if (hasOwnProperty(allKeys, objKey)) {
            const element = allKeys[objKey];
            if (isArray(element) && isArray<unknown[]>(objs)) {
                const maxLength = objs.reduce<number>(
                    (acc, v) => acc + v.length,
                    0
                );
                for (let i = 0; i < maxLength; i++)
                    element[i] = mergeObjects(...objs.map((obj) => obj[i]));
            } else
                allKeys[objKey] = mergeObjects(
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                    ...objs.map((obj) => obj[objKey])
                );
        }
    }
    return allKeys;
}
