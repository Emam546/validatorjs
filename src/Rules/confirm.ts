import {Validator} from "../main";
import Rule, { RuleFun, StoredMessage } from "../Rule";
import LangTypes from "../types/lang";
import compare from "../utils/compare";
import handelMessage from "../utils/handelMessage";
import handelUndefined from "../utils/handelUndefined";
import handelUnError from "../utils/handelUnError";
import ValueNotExist from "./Messages/valueNotExist";
import ValuesNotSame from "./Messages/ValuesNotSame";

function Confirm(
    ...[value,name,validator,path,lang]:Parameters<RuleFun>
): StoredMessage | undefined {
    const returnedValue = validator.getValue(path + "_confirmation");
    if (returnedValue == undefined) return handelUndefined(ValueNotExist[lang]);
    if (!compare(value, returnedValue))
        return handelUndefined(ValuesNotSame[lang]);
}

export default new Rule(
    "confirm",
    (...arr) => {
        return handelUnError(Confirm(...arr),...arr);
    },

);
