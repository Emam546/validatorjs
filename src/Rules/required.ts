import Rule, { InitSubmitFun, RuleFun } from "../Rule";
import LangTypes from "../types/lang";
import { getAllValues, getValue } from "../utils/getValue";
import handelMessage from "../utils/handelMessage";
import { isArray } from "../utils/types";
import ValueNotExist from "./Messages/valueNotExist";

export function getValueMessage(
    orgPath:string,
    ...[inputs,name,validator,path,lang]:Parameters<RuleFun>
    
): ReturnType<InitSubmitFun> {
    const paths:any[] = orgPath.split(".");
    let currObj = inputs;
    for (let i = 0; i < paths.length; i++) {
        if (paths[i].startsWith("*")) {
            const index =parseInt(paths[i].slice(1))
            const respath=paths.slice(i).join(".")
            if(isNaN(index)){
                const message=`unrecognizable number ${paths[i]}`
                return {[respath]:[{message,value:currObj[paths[i]]}]};
            }
            paths[i]=index
            if (!isArray(currObj)){
                const message="the value is not an array"
                return {[respath]:[{message,value:currObj[paths[i]]}]};
            }

        } 
        if (typeof currObj[paths[i]] == "undefined"){
            const message=handelMessage(ValueNotExist[lang],inputs,name,validator,path,lang)
            const respath=paths.slice(i).join(".")
            return {[respath]:[{message,value:currObj[paths[i]]}]};
        }
        else currObj = currObj[paths[i]];
    }
    return {}
}
function require_if(...[inputs,name,validator,path,lang]:Parameters<RuleFun>):ReturnType<InitSubmitFun>{
    const ObjectPath = path.split(".").slice(0, -1).join(".");
    const allObjects = getAllValues(inputs, ObjectPath);
    const Ppath = path.split(".").at(-1);
    let errors:ReturnType<InitSubmitFun>={}
    if (Ppath)
        for (const objPath in allObjects) {
            const element = allObjects[objPath];
            const finalPath=objPath?objPath+"."+Ppath:Ppath
            if (getValue(element, Ppath)===undefined) {
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
export default new Rule(
    "required",
    () => undefined,
    (name, Validator, ...a) => require_if(Validator.inputs, name, Validator, ...a)
);
