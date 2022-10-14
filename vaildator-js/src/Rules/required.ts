import Validator from "../main";
import Rule, { InitSubmitFun } from "../Rule";
import LangTypes from "../types/lang";
import handelMessage from "../utils/handelMessage";
import ValueNotExist from "./Messages/valueNotExist";

export function getValue(
    inputs: any,
    name: string,
    validator: Validator,
    path: string,
    lang: LangTypes
): ReturnType<InitSubmitFun> {
    const paths = path.split(".");
    let currObj = inputs;
    for (let i = 0; i < paths.length; i++) {
        if (paths[i].startsWith("*") && i != paths.length - 1) {
            for (const ui in currObj) {
                const element = currObj[ui];
                if (
                    getValue(
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
export default new Rule(
    "required",
    () => undefined,
    (name, Validator, ...a) => getValue(Validator.inputs, name, Validator, ...a)
);
