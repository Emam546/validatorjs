import Validator from "../main";
import Rule, { GetMessageFun, InitSubmitFun, RuleFun } from "../Rule";
import LangTypes from "../types/lang";
import compare from "../utils/compare";
import { getAllValues, getValue } from "../utils/getValue";
import { getValue as getValueRequired } from "./required";

function _require_if(
    inputs: any,
    name: string,
    validator: Validator,
    path: string,
    lang: LangTypes
): ReturnType<RuleFun> {
    let vpath, value;
    vpath = name.split(":")[1].split(",")[0];
    value = JSON.parse(name.split(":")[1].split(",").slice(1).join(","));
    const ObjectPath = path.split(".").slice(0, -1).join(".");
    const allObjects = getAllValues(inputs, ObjectPath);
    const Ppath = path.split(".").at(-1);
    if (Ppath)
        for (const key in allObjects) {
            const element = allObjects[key];
            const val = getValue(element, vpath);
            if (compare(val, value)) {
                const res = getValueRequired(
                    element,
                    "required",
                    validator,
                    Ppath,
                    lang
                );
                if (res != undefined) return res;
            }
        }
}
function _require_unless(
    inputs: any,
    name: string,
    validator: Validator,
    path: string,
    lang: LangTypes
): ReturnType<RuleFun> {
    let vpath, value;
    vpath = name.split(":")[1].split(",")[0];
    value = JSON.parse(name.split(":")[1].split(",").slice(1).join(","));
    const ObjectPath = path.split(".").slice(0, -1).join(".");
    const allObjects = getAllValues(inputs, ObjectPath);
    const Ppath = path.split(".").at(-1);
    if (Ppath)
        for (const key in allObjects) {
            const element = allObjects[key];
            const val = getValue(element, vpath);
            if (!compare(val, value)) {
                const res = getValueRequired(
                    element,
                    "required",
                    validator,
                    Ppath,
                    lang
                );
                if (res != undefined) return res;
            }
        }
}
export const require_if = new Rule(
    /(^required_if:)\S+,\S+/,
    () => undefined,
    (name, Validator, ...a) =>
        _require_if(Validator.inputs, name, Validator, ...a)
);
export const require_unless = new Rule(
    /(^required_unless:)\S+,\S+/,
    () => undefined,
    (name, Validator, ...a) =>
    _require_unless(Validator.inputs, name, Validator, ...a)
);
