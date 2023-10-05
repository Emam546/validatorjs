import Rule, { RuleFun } from "@/Rule";
import compare from "@/utils/compare";
import handelUndefined from "@/utils/handelUndefined";
import handelUnError from "@/utils/handelUnError";
import ValueNotExist from "./Messages/valueNotExist";
import ValuesNotSame from "./Messages/ValuesNotSame";

const Confirm: RuleFun<unknown> = function (...arr) {
    const [value, _, validator, path, lang] = arr;
    const returnedValue = validator.getValue(path + "_confirmation");
    if (returnedValue == undefined)
        return handelUnError(handelUndefined(ValueNotExist[lang]), ...arr);
    if (!compare(value, returnedValue))
        return handelUnError(handelUndefined(ValuesNotSame[lang]), ...arr);
    return undefined;
};

export default new Rule("confirm", Confirm);
