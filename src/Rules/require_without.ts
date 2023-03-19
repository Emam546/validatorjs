/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Rule, { InitSubmitFun, RuleFun, _Error } from "../Rule";
import { getAllValues, getValue } from "../utils/getValue";
import { getValueMessage } from "./required";

 function _require_without<Input, Data>(
    ...[inputs, name, validator, path, lang]: Parameters<RuleFun<Input, Data>>
): ReturnType<InitSubmitFun<Input, Data>> {
    const vpaths = name.split(":")[1].split(",");
    const ObjectPath = path.split(".").slice(0, -1).join(".");
    const allObjects = getAllValues(inputs, ObjectPath);
    const Ppath = path.split(".").at(-1);
    let errors: Record<string, _Error[]> = {};

    if (Ppath)
        for (const objPath in allObjects) {
            const element = allObjects[objPath];
            const finalPath = objPath ? objPath + "." + Ppath : Ppath;

            if (
                vpaths.some((vpath) => getValue(element, vpath) === undefined)
            ) {
                errors = {
                    ...errors,
                    ...( getValueMessage(
                        finalPath,
                        inputs,
                        "required",
                        validator,
                        Ppath,
                        lang
                    )),
                };
            }
        }
    return errors;
}
 function _require_withoutAll<Input, Data>(
    ...[inputs, name, validator, path, lang]: Parameters<RuleFun<Input, Data>>
): ReturnType<InitSubmitFun<Input, Data>> {
    const vpaths = name.split(":")[1].split(",");
    const ObjectPath = path.split(".").slice(0, -1).join(".");
    const allObjects = getAllValues(inputs, ObjectPath);
    const Ppath = path.split(".").at(-1);
    let errors: Record<string, _Error[]> = {};

    if (Ppath)
        for (const objPath in allObjects) {
            const element = allObjects[objPath];
            const finalPath = objPath ? objPath + "." + Ppath : Ppath;

            if (
                vpaths.every((vpath) => getValue(element, vpath) === undefined)
            ) {
                errors = {
                    ...errors,
                    ...(getValueMessage(
                        finalPath,
                        inputs,
                        "required",
                        validator,
                        Ppath,
                        lang
                    )),
                };
            }
        }
    return errors;
}
export const require_without = new Rule(
    /^required_without:(.+,)*[^,]+/,
    () => undefined,
    (name, Validator, ...a) =>
        _require_without(Validator.inputs, name, Validator, ...a)
);
export const require_withoutAll = new Rule(
    /^required_withoutALl:(.+,)*[^,]+/,
    () => undefined,
    (name, Validator, ...a) =>
        _require_withoutAll(Validator.inputs, name, Validator, ...a)
);
