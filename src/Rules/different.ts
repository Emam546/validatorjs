import Rule, { RuleFun, StoredMessage } from "../Rule";

import compare from "../utils/compare";
import handelUndefined from "../utils/handelUndefined";
import handelUnError from "../utils/handelUnError";
import ValuesNotSame from "./Messages/ValuesNotSame";
function different<Input, Data>(
    ...[value, name, Validator, path, lang]: Parameters<RuleFun<Input, Data>>
): StoredMessage<Input> | undefined {
    const allPaths = path.split(".");
    const different = name.split(":").slice(1).join(":");
    const differentPath =
        allPaths.length > 1
            ? allPaths.slice(0, allPaths.length - 1).join(".") + "." + different
            : different;
    const differentValue = Validator.getValue(differentPath);
    if (differentValue != undefined && compare(value, differentValue))
        return handelUndefined(ValuesNotSame[lang]);
}
const regEx = /^different:(.+)/gi;
export default new Rule(regEx, (...arr) => {
    return handelUnError(different(...arr), ...arr);
});
