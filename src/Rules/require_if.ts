import Rule, { MessagesStore } from "@/Rule";
import compare, { hasOwnProperty } from "@/utils/compare";
import { getAllValues, getValue } from "@/utils/getValue";
import { isString } from "@/utils/types";
import { objectKeys } from "@/utils";
import handelMessage from "@/utils/handelMessage";

export const Messages: MessagesStore<unknown> = {
    en: "the input value is not equal the another value",
};
export const require_if = new Rule<{
    required_if: { path: string; value: unknown };
}>(
    (
        val: unknown
    ): val is { required_if: { path: string; value: unknown } } => {
        return (
            hasOwnProperty(val, "required_if") &&
            hasOwnProperty(val.required_if, "path") &&
            hasOwnProperty(val.required_if, "value") &&
            isString(val.required_if.path)
        );
    },
    () => undefined,
    Messages,
    function _require_if(input, data, path, lang, errors) {
        const vpath = data.required_if.path;

        const ObjectPath = path.split(".").slice(0, -1).join(".");
        const allObjects = getAllValues(input, ObjectPath);
        const Ppath = path.split(".").at(-1) as string;

        return objectKeys(allObjects).reduce((acc, objPath) => {
            const element = allObjects[objPath];
            const val = getValue(element, vpath);
            const curVal = getValue(element, Ppath);
            const finalPath =
                objPath && objPath != "." ? objPath + "." + Ppath : Ppath;
            if (compare(val, data.required_if.value) && curVal == undefined) {
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
export const require_unless = new Rule<{
    require_unless: { path: string; value: unknown };
}>(
    (
        val: unknown
    ): val is { require_unless: { path: string; value: unknown } } => {
        return (
            hasOwnProperty(val, "require_unless") &&
            hasOwnProperty(val.require_unless, "path") &&
            hasOwnProperty(val.require_unless, "value") &&
            isString(val.require_unless.path)
        );
    },
    () => undefined,
    Messages,
    function _require_unless(input, data, path, lang, errors) {
        const vpath = data.require_unless.path;

        const ObjectPath = path.split(".").slice(0, -1).join(".");
        const allObjects = getAllValues(input, ObjectPath);
        const Ppath = path.split(".").at(-1) as string;
        return objectKeys(allObjects).reduce((acc, objPath) => {
            const element = allObjects[objPath];
            const val = getValue(element, vpath);
            const curVal = getValue(element, Ppath);

            const finalPath =
                objPath && objPath != "." ? objPath + "." + Ppath : Ppath;
            if (
                !compare(val, data.require_unless.value) &&
                curVal == undefined
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
