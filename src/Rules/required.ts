import Validator from "../main";
import Rule, { InitSubmitFun, RuleFun } from "../Rule";
import LangTypes from "../types/lang";
import { getAllValues, getValue } from "../utils/getValue";
import handelMessage from "../utils/handelMessage";
import ValueNotExist from "./Messages/valueNotExist";

export function getValueMessage(
    inputs: any,
    name: string,
    validator: Validator,
    path: string,
    lang: LangTypes,
    
): ReturnType<InitSubmitFun> {
    const paths = path.split(".");
    let currObj = inputs;
    for (let i = 0; i < paths.length; i++) {
        if (paths[i].startsWith("*") && i != paths.length - 1) {
            for (const ui in currObj) {
                const element = currObj[ui];
                if (
                    element!=undefined&&
                    getValueMessage(
                        element,
                        name,
                        validator,
                        paths.slice(i + 1).join("."),
                        lang
                    ) != undefined
                )
                    return handelMessage(
                        ValueNotExist[lang],
                        inputs,
                        name,
                        validator,
                        path,
                        lang
                    );
            }
            return 
        } else if (typeof currObj[paths[i]] == "undefined")
            return handelMessage(
                ValueNotExist[lang],
                inputs,
                name,
                validator,
                path,
                lang
            );
        else currObj = currObj[paths[i]];
    }
    
}
function require_if(...[inputs,name,validator,path,lang]:Parameters<RuleFun>){
    const ObjectPath = path.split(".").slice(0, -1).join(".");
    const allObjects = getAllValues(inputs, ObjectPath);
    const Ppath = path.split(".").at(-1);

    if (Ppath)
        for (const key in allObjects) {
            const element = allObjects[key];
            
            if (getValue(element, Ppath)===undefined) {
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
export default new Rule(
    "required",
    () => undefined,
    (name, Validator, ...a) => require_if(Validator.inputs, name, Validator, ...a)
);
