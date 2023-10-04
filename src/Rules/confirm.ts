import Rule, { RuleFun, StoredMessage } from "@/Rule";
import compare from "@/utils/compare";
import handelUndefined from "@/utils/handelUndefined";
import handelUnError from "@/utils/handelUnError";
import ValueNotExist from "./Messages/valueNotExist";
import ValuesNotSame from "./Messages/ValuesNotSame";

function Confirm<Data>(
    ...[value, , validator, path, lang]: Parameters<RuleFun<Data>>
): StoredMessage | undefined {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const returnedValue = validator.getValue(path + "_confirmation");
    if (returnedValue == undefined) return handelUndefined(ValueNotExist[lang]);
    if (!compare(value, returnedValue))
        return handelUndefined(ValuesNotSame[lang]);
    return undefined;
}

export default new Rule("confirm", (...arr) => {
    return handelUnError(Confirm(...arr), ...arr);
});
