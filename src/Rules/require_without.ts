
import Rule, {  InitSubmitFun, RuleFun } from "../Rule";
import { getAllValues, getValue } from "../utils/getValue";
import { getValueMessage } from "./required";


function _require_without(
    ...[inputs,name,validator,path,lang]:Parameters<RuleFun>
): ReturnType<InitSubmitFun> {
    let vpaths = name.split(":")[1].split(",");
    const ObjectPath = path.split(".").slice(0, -1).join(".");
    const allObjects = getAllValues(inputs, ObjectPath);
    const Ppath = path.split(".").at(-1);
    let errors: ReturnType<InitSubmitFun>={}
    if (Ppath)
        for (const objPath in allObjects) {
            const element = allObjects[objPath];
            const finalPath=objPath?objPath+"."+Ppath:Ppath

            if (vpaths.some((vpath) => getValue(element, vpath) === undefined)) {
                errors={...errors,...getValueMessage(
                    finalPath,
                    inputs,
                    "required",
                    validator,
                    Ppath,
                    lang
                )}
            }
        }
    return errors
}
function _require_withoutAll(
    ...[inputs,name,validator,path,lang]:Parameters<RuleFun>
): ReturnType<InitSubmitFun> {
    let vpaths = name.split(":")[1].split(",");
    const ObjectPath = path.split(".").slice(0, -1).join(".");
    const allObjects = getAllValues(inputs, ObjectPath);
    const Ppath = path.split(".").at(-1);
    let errors: ReturnType<InitSubmitFun>={}

    if (Ppath)
        for (const objPath in allObjects) {
            const element = allObjects[objPath];
            const finalPath=objPath?objPath+"."+Ppath:Ppath

            if (
                vpaths.every((vpath) => getValue(element, vpath) === undefined)
            ) {
                errors={...errors,...getValueMessage(
                    finalPath,
                    inputs,
                    "required",
                    validator,
                    Ppath,
                    lang
                )}
            }
        }
    return errors
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
