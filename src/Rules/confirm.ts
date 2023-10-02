import Rule, { RuleFun, StoredMessage } from "@/Rule";
import compare from "@/utils/compare";
import handelUndefined from "@/utils/handelUndefined";
import handelUnError from "@/utils/handelUnError";
import ValueNotExist from "./Messages/valueNotExist";
import ValuesNotSame from "./Messages/ValuesNotSame";

function Confirm<Input, Data>(
    ...[value, , validator, path, lang]: Parameters<RuleFun<Input, Data>>
): StoredMessage<Input> | undefined {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const returnedValue = validator.getValue(path + "_confirmation");
    if (returnedValue == undefined)
        return handelUndefined<Input>(ValueNotExist[lang]);
    if (!compare(value, returnedValue))
        return handelUndefined<Input>(ValuesNotSame[lang]);
    return undefined;
}

export default new Rule("confirm", (...arr) => {
    return handelUnError(Confirm(...arr), ...arr);
});
