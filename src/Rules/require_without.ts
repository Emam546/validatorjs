/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Rule, { ErrorMessage } from "@/Rule";
import { getAllValues, getValue } from "@/utils/getValue";
import { getValueMessage } from "./required";
import { isArray } from "@/utils/types";
import { hasOwnProperty } from "@/utils/compare";

export const require_without = new Rule<{ required_without: Array<string> }>(
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
        const Ppath = path.split(".").at(-1);
        let errors: Record<string, ErrorMessage> = {};

        if (Ppath)
            for (const objPath in allObjects) {
                const element = allObjects[objPath];
                const finalPath = objPath ? objPath + "." + Ppath : Ppath;

                if (
                    vpaths.some(
                        (vpath) => getValue(element, vpath) === undefined
                    )
                ) {
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
    function _require_withoutAll(inputs, data, path, lang) {
        const vpaths = data.required_withoutAll;
        const ObjectPath = path.split(".").slice(0, -1).join(".");
        const allObjects = getAllValues(inputs, ObjectPath);
        const Ppath = path.split(".").at(-1);
        let errors: Record<string, ErrorMessage> = {};

        if (Ppath)
            for (const objPath in allObjects) {
                const element = allObjects[objPath];
                const finalPath = objPath ? objPath + "." + Ppath : Ppath;

                if (
                    vpaths.every(
                        (vpath) => getValue(element, vpath) === undefined
                    )
                ) {
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
