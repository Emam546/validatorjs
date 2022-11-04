import Validator from "../main";
import Rule, {  RuleFun } from "../Rule";
import LangTypes from "../types/lang";
import { getAllValues, getValue } from "../utils/getValue";
import { getValueMessage } from "./required";


function _require_without(
    inputs: any,
    name: string,
    validator: Validator,
    path: string,
    lang: LangTypes
): ReturnType<RuleFun> {
    let vpaths = name.split(":")[1].split(",");
    const ObjectPath = path.split(".").slice(0, -1).join(".");
    const allObjects = getAllValues(inputs, ObjectPath);
    const Ppath = path.split(".").at(-1);

    if (Ppath)
        for (const key in allObjects) {
            const element = allObjects[key];
            if (vpaths.some((vpath) => getValue(element, vpath) === undefined)) {
                const res = getValueMessage(
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
function _require_withoutAll(
    inputs: any,
    name: string,
    validator: Validator,
    path: string,
    lang: LangTypes
): ReturnType<RuleFun> {
    let vpaths = name.split(":")[1].split(",");
    const ObjectPath = path.split(".").slice(0, -1).join(".");
    const allObjects = getAllValues(inputs, ObjectPath);
    const Ppath = path.split(".").at(-1);

    if (Ppath)
        for (const key in allObjects) {
            const element = allObjects[key];
            if (
                vpaths.every((vpath) => getValue(element, vpath) == undefined)
            ) {
                const res = getValueMessage(
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
export const require_without = new Rule(
    /(^required_without:)(\S+,)*\S+/,
    () => undefined,
    (name, Validator, ...a) =>
        _require_without(Validator.inputs, name, Validator, ...a)
);
export const require_withoutAll = new Rule(
    /(^required_withoutALl:)(\S+,)*\S+/,
    () => undefined,
    (name, Validator, ...a) =>
        _require_withoutAll(Validator.inputs, name, Validator, ...a)
);
