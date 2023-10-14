import Rule from "@/Rule";
import { getAllValues, getValue } from "@/utils/getValue";
import { ValueNotExist as Messages } from "./required";
export { ValueNotExist as Messages } from "./required";
import { isArray } from "@/utils/types";
import { hasOwnProperty } from "@/utils/compare";
import { objectKeys } from "@/utils";
import handelMessage from "@/utils/handelMessage";

export const require_without = new Rule<{ required_without: Array<string> }>(
    (val: unknown): val is { required_without: Array<string> } => {
        return (
            hasOwnProperty(val, "required_without") &&
            isArray(val.required_without)
        );
    },

    () => undefined,
    Messages,
    function require_without(inputs, data, path, lang, errors) {
        const vpaths = data.required_without;
        const ObjectPath = path.split(".").slice(0, -1).join(".");
        const allObjects = getAllValues(inputs, ObjectPath);
        const Ppath = path.split(".").at(-1) as string;
        return objectKeys(allObjects).reduce((acc, objPath) => {
            const element = allObjects[objPath];
            const finalPath =
                objPath && objPath != "." ? objPath + "." + Ppath : Ppath;
            const curVal = getValue(element, Ppath);
            if (
                curVal == undefined &&
                vpaths.some((vpath) => getValue(element, vpath) === undefined)
            ) {
                return {
                    ...acc,
                    [finalPath]: {
                        message: handelMessage(
                            errors[lang],
                            curVal,
                            data,
                            finalPath,
                            inputs,
                            lang
                        ),
                        value: curVal,
                    },
                };
            }
            return acc;
        }, {});
    }
);
export const require_withoutAll = new Rule<{
    required_withoutAll: Array<string>;
}>(
    (val: unknown): val is { required_withoutAll: Array<string> } => {
        return (
            hasOwnProperty(val, "required_withoutAll") &&
            isArray(val.required_withoutAll)
        );
    },
    () => undefined,
    Messages,
    function _require_withoutAll(input, data, path, lang, errors) {
        const vpaths = data.required_withoutAll;
        const ObjectPath = path.split(".").slice(0, -1).join(".");
        const allObjects = getAllValues(input, ObjectPath);
        const Ppath = path.split(".").at(-1) as string;
        return objectKeys(allObjects).reduce((acc, objPath) => {
            const element = allObjects[objPath];
            const finalPath =
                objPath && objPath != "." ? objPath + "." + Ppath : Ppath;
            const curVal = getValue(element, Ppath);
            if (
                curVal == undefined &&
                vpaths.every((vpath) => getValue(element, vpath) === undefined)
            ) {
                return {
                    ...acc,
                    [finalPath]: {
                        message: handelMessage(
                            errors[lang],
                            curVal,
                            data,
                            finalPath,
                            input,
                            lang
                        ),
                        value: curVal,
                    },
                };
            }
            return acc;
        }, {});
    }
);
