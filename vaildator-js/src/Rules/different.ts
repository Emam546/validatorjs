import Validator from "../main";
import Rule, { StoredMessage } from "../Rule";
import LangTypes from "../types/lang";
import compare from "../utils/compare";
import handelUndefined from "../utils/handelUndefined";
import handelUnError from "../utils/handelUnError";
import ValueNotExist from "./Messages/valueNotExist";
import ValuesNotSame from "./Messages/ValuesNotSame";
function different(
    value: any,
    name: string,
    Validator: Validator,
    path: string,
    lang: LangTypes
): StoredMessage | undefined {
    const allPaths = path.split(".");
    const different = name.split(":").slice(1).join(":");
    const differentPath =allPaths.length>1?
        allPaths.slice(0, allPaths.length - 1).join(".") + "." + different
        :different;
    const differentValue = Validator.getValue(differentPath);
    if (differentValue != undefined && compare(value, differentValue))
        return handelUndefined(ValuesNotSame[lang]);
}
export default new Rule(
    /(^different:)\S+/,
    (...arr) => {
        return handelUnError(different(...arr),...arr);
    },
    
);
