/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Rule, { ErrorMessage } from "@/Rule";
import compare, { hasOwnProperty } from "@/utils/compare";
import { getAllValues, getValue } from "@/utils/getValue";
import { getValueMessage } from "./required";
import { isString } from "@/utils/types";

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
    function _require_if(inputs, data, path, lang) {
        const vpath = data.required_if.path;

        const ObjectPath = path.split(".").slice(0, -1).join(".");
        const allObjects = getAllValues(inputs, ObjectPath);
        const Ppath = path.split(".").at(-1);
        let errors: Record<string, ErrorMessage> = {};

        if (Ppath)
            for (const objPath in allObjects) {
                const element = allObjects[objPath];
                const val = getValue(element, vpath);
                const finalPath = objPath ? objPath + "." + Ppath : Ppath;
                if (compare(val, data.required_if.value)) {
                    errors = {
                        ...errors,
                        ...getValueMessage(
                            finalPath,
                            inputs,
                            data,
                            Ppath,
                            lang
                        ),
                    };
                }
            }
        return errors;
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
    function _require_unless(inputs, data, path, lang) {
        const vpath = data.require_unless.path;

        const ObjectPath = path.split(".").slice(0, -1).join(".");
        const allObjects = getAllValues(inputs, ObjectPath);
        const Ppath = path.split(".").at(-1);
        let errors: Record<string, ErrorMessage> = {};

        if (Ppath)
            for (const objPath in allObjects) {
                const element = allObjects[objPath];
                const val = getValue(element, vpath);
                const finalPath = objPath ? objPath + "." + Ppath : Ppath;
                if (!compare(val, data.require_unless.value)) {
                    errors = {
                        ...errors,
                        ...getValueMessage(
                            finalPath,
                            inputs,
                            data,
                            Ppath,
                            lang
                        ),
                    };
                }
            }
        return errors;
    }
);
