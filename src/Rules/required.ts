/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Rule, { InitSubmitFun, RuleFun, _Error } from "@/Rule";
import { hasOwnProperty } from "@/utils/compare";
import { getAllValues, getValue } from "@/utils/getValue";
import handelMessage from "@/utils/handelMessage";
import { isArray } from "@/utils/types";
import ValueNotExist from "./Messages/valueNotExist";

export function getValueMessage<Data>(
    orgPath: string,
    ...[inputs, name, validator, path, lang]: Parameters<RuleFun<Data>>
): Record<string, _Error[]> {
    const paths = orgPath.split(".");
    let currObj: any = inputs;
    for (let i = 0; i < paths.length; i++) {
        if (paths[i].startsWith("*")) {
            const index = parseInt(paths[i].slice(1));
            const respath = paths.slice(i).join(".");
            if (isNaN(index)) {
                const message = `unrecognizable number ${paths[i]}`;
                return {
                    [respath]: [{ message, value: currObj[paths[i]] }],
                };
            }
            paths[i] = index as unknown as string;
            if (!isArray(currObj)) {
                const message = "the value is not an array";
                return {
                    [respath]: [{ message, value: currObj[paths[i]] }],
                };
            }
        }
        if (!hasOwnProperty(currObj, paths[i])) {
            const message = handelMessage(
                ValueNotExist[lang],
                inputs,
                name,
                validator,
                path,
                lang
            );
            const respath = paths.slice(i).join(".");
            return { [respath]: [{ message, value: currObj[paths[i]] }] };
        } else currObj = currObj[paths[i]];
    }
    return {};
}
function require_if<Data>(
    ...[inputs, , validator, path, lang]: Parameters<RuleFun<Data>>
): ReturnType<InitSubmitFun<Data>> {
    const ObjectPath = path.split(".").slice(0, -1).join(".");
    const allObjects = getAllValues(inputs, ObjectPath);
    const Ppath = path.split(".").at(-1);
    let errors: Record<string, _Error[]> = {};
    if (Ppath)
        for (const objPath in allObjects) {
            const element = allObjects[objPath];
            const finalPath = objPath ? objPath + "." + Ppath : Ppath;
            if (getValue(element, Ppath) === undefined) {
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
export default new Rule<"required", Exclude<unknown, undefined>>(
    "required",
    () => undefined,
    (name, Validator, ...a) =>
        require_if(Validator.inputs, name, Validator, ...a)
);
