/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Rule, { InitSubmitFun, RuleFun, _Error } from "@/Rule";
import compare from "@/utils/compare";
import { getAllValues, getValue } from "@/utils/getValue";
import { getValueMessage } from "./required";

function _require_if<Data>(
    ...[inputs, name, validator, path, lang]: Parameters<RuleFun<Data>>
): ReturnType<InitSubmitFun<Data>> {
    const vpath = name.split(":")[1].split(",")[0];
    const value = JSON.parse(name.split(":")[1].split(",").slice(1).join(","));
    const ObjectPath = path.split(".").slice(0, -1).join(".");
    const allObjects = getAllValues(inputs, ObjectPath);
    const Ppath = path.split(".").at(-1);
    let errors: Record<string, _Error[]> = {};

    if (Ppath)
        for (const objPath in allObjects) {
            const element = allObjects[objPath];
            const val = getValue(element, vpath);
            const finalPath = objPath ? objPath + "." + Ppath : Ppath;
            if (compare(val, value)) {
                errors = {
                    ...errors,
                    ...getValueMessage(
                        finalPath,
                        inputs,
                        "required",
                        validator,
                        Ppath,
                        lang
                    ),
                };
            }
        }
    return errors;
}
function _require_unless<Data>(
    ...[inputs, name, validator, path, lang]: Parameters<RuleFun<Data>>
): ReturnType<InitSubmitFun<Data>> {
    const vpath = name.split(":")[1].split(",")[0];
    const value = JSON.parse(name.split(":")[1].split(",").slice(1).join(","));
    const ObjectPath = path.split(".").slice(0, -1).join(".");
    const allObjects = getAllValues(inputs, ObjectPath);
    const Ppath = path.split(".").at(-1);
    let errors: Record<string, _Error[]> = {};

    if (Ppath)
        for (const objPath in allObjects) {
            const element = allObjects[objPath];
            const val = getValue(element, vpath);
            const finalPath = objPath ? objPath + "." + Ppath : Ppath;
            if (!compare(val, value)) {
                errors = {
                    ...errors,
                    ...getValueMessage(
                        finalPath,
                        inputs,
                        "required",
                        validator,
                        Ppath,
                        lang
                    ),
                };
            }
        }
    return errors;
}
export const require_if = new Rule<`required_if:${string}`>(
    /(^required_if:).+,[^,]+/,
    () => undefined,
    (name, Validator, ...a) =>
        _require_if(Validator.inputs, name, Validator, ...a)
);
export const require_unless = new Rule<`required_unless:${string}`>(
    /(^required_unless:).+,[^,]+/,
    () => undefined,
    (name, Validator, ...a) =>
        _require_unless(Validator.inputs, name, Validator, ...a)
);
