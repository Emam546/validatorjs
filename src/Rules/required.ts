/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Rule from "@/Rule";
import { getAllValues, getValue } from "@/utils/getValue";
import handelMessage from "@/utils/handelMessage";
import Messages from "./Messages/valueNotExist";
import { objectKeys } from "@/utils";
export { default as ValueNotExist } from "./Messages/valueNotExist";

export default new Rule(
    "required",
    () => undefined,
    Messages,
    function required(inputs, data, path, lang, errors) {
        const ObjectPath = path.split(".").slice(0, -1).join(".");
        const allObjects = getAllValues(inputs, ObjectPath);
        const Ppath = path.split(".").at(-1);
        if (!Ppath) return {};
        return objectKeys(allObjects).reduce((acc, objPath) => {
            const element = allObjects[objPath];
            const finalPath =
                objPath && objPath != "." ? objPath + "." + Ppath : Ppath;
            const curVal = getValue(element, Ppath);
            if (curVal === undefined) {
                return {
                    ...acc,
                    [finalPath]: {
                        message: handelMessage(
                            errors[lang],
                            curVal,
                            data,
                            finalPath,
                            inputs,
                            lang
                        ),
                        value: curVal,
                    },
                };
            }
            return acc;
        }, {});
    }
);
