import Rule, {  InitSubmitFun, RuleFun } from "../Rule";
import compare from "../utils/compare";
import { getAllValues, getValue } from "../utils/getValue";
import { getValueMessage } from "./required";

function _require_if(
    ...[inputs,name,validator,path,lang]:Parameters<RuleFun>
): ReturnType<InitSubmitFun> {
    let vpath, value;
    vpath = name.split(":")[1].split(",")[0];
    value = JSON.parse(name.split(":")[1].split(",").slice(1).join(","));
    const ObjectPath = path.split(".").slice(0, -1).join(".");
    const allObjects = getAllValues(inputs, ObjectPath);
    const Ppath = path.split(".").at(-1);
    let errors:ReturnType<InitSubmitFun>={}

    if (Ppath)
        for (const objPath in allObjects) {
            const element = allObjects[objPath];
            const val = getValue(element, vpath);
            const finalPath=objPath?objPath+"."+Ppath:Ppath
            if (compare(val, value)) {
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
function _require_unless(
    ...[inputs,name,validator,path,lang]:Parameters<RuleFun>
): ReturnType<InitSubmitFun> {
    let vpath, value;
    vpath = name.split(":")[1].split(",")[0];
    value = JSON.parse(name.split(":")[1].split(",").slice(1).join(","));
    const ObjectPath = path.split(".").slice(0, -1).join(".");
    const allObjects = getAllValues(inputs, ObjectPath);
    const Ppath = path.split(".").at(-1);
    let errors:ReturnType<InitSubmitFun>={}
    if (Ppath)
        for (const objPath in allObjects) {
            const element = allObjects[objPath];
            const val = getValue(element, vpath);
            const finalPath=objPath?objPath+"."+Ppath:Ppath
            if (!compare(val, value)) {
                errors={...errors, ...getValueMessage(
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
export const require_if = new Rule(
    /(^required_if:).+,[^,]+/,
    () => undefined,
    (name, Validator, ...a) =>
        _require_if(Validator.inputs, name, Validator, ...a)
);
export const require_unless = new Rule(
    /(^required_unless:).+,[^,]+/,
    () => undefined,
    (name, Validator, ...a) =>
    _require_unless(Validator.inputs, name, Validator, ...a)
);
