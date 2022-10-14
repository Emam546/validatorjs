import { isArray, isNumber, isString } from "./types";
function filterObj(obj: any) {
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
    });
    for (const objKey in allKeys) {
        if (Object.prototype.hasOwnProperty.call(allKeys, objKey)) {
            const element = allKeys[objKey];
            if (element instanceof Array) {
                const maxLength = objs.reduce((acc, v) => acc + v.length, 0);
                for (let i = 0; i < maxLength; i++)
                    allKeys[objKey][i] = mergeObjects(
                        ...objs.map((obj) => obj[i])
                    );
            } else
                allKeys[objKey] = mergeObjects(
                    ...objs.map((obj) => obj[objKey])
                );
        }
    }
    return allKeys;
}
