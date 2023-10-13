import Rule, { ErrorMessage } from "@/Rule";
import { getAllValues, getValue } from "@/utils/getValue";
import { ValueNotExist } from "./required";
export { ValueNotExist as Messages } from "./required";
import { isArray } from "@/utils/types";
import { hasOwnProperty } from "@/utils/compare";
import { objectKeys } from "@/utils";
import handelMessage from "@/utils/handelMessage";

export const require_without = new Rule<
    Validator.AvailableRules["required_without"]["path"]
>(
    (val: unknown): val is { required_without: Array<string> } => {
        return (
            hasOwnProperty(val, "required_without") &&
            isArray(val.required_without)
        );
    },

    () => undefined,
    function _require_without(inputs, data, path, lang) {
        const vpaths = data.required_without;
        const ObjectPath = path.split(".").slice(0, -1).join(".");
        const allObjects = getAllValues(inputs, ObjectPath);
        const Ppath = path.split(".").at(-1) as string;
        let errors: Record<string, ErrorMessage> = {};

        for (const objPath in allObjects) {
            const element = allObjects[objPath];
            const finalPath =
                objPath && objPath != "." ? objPath + "." + Ppath : Ppath;
            const curVal = getValue(element, Ppath);
            if (
                curVal == undefined &&
                vpaths.some((vpath) => getValue(element, vpath) === undefined)
            ) {
                errors = {
                    ...errors,
                    [finalPath]: {
                        message: handelMessage(
                            ValueNotExist[lang],
                            curVal,
                            data,
                            finalPath,
                            lang
                        ),
                        value: curVal,
                    },
                };
            }
        }
        return errors;
    }
);
export const require_withoutAll = new Rule<
    Validator.AvailableRules["required_withoutAll"]["path"]
>(
    (val: unknown): val is { required_withoutAll: Array<string> } => {
        return (
            hasOwnProperty(val, "required_withoutAll") &&
            isArray(val.required_withoutAll)
        );
    },
    () => undefined,
    function _require_withoutAll(inputs, data, path, lang) {
        const vpaths = data.required_withoutAll;
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
                vpaths.every((vpath) => getValue(element, vpath) === undefined)
            ) {
                return {
                    ...acc,
                    [finalPath]: {
                        message: handelMessage(
                            ValueNotExist[lang],
                            curVal,
                            data,
                            finalPath,
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
