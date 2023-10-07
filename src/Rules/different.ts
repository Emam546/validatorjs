import Rule, { RuleFun } from "@/Rule";

import compare from "@/utils/compare";
import handelUndefined from "@/utils/handelUndefined";
import handelUnError from "@/utils/handelUnError";
import ValuesNotSame from "./Messages/ValuesNotSame";
const different: RuleFun<unknown> = function (...arr) {
    const [value, name, Validator, path, lang] = arr;
    const allPaths = path.split(".");
    const different = name.split(":").slice(1).join(":");
    const differentPath =
        allPaths.length > 1
            ? allPaths.slice(0, allPaths.length - 1).join(".") + "." + different
            : different;
    const differentValue = Validator.getValue(differentPath);
    if (differentValue != undefined && compare(value, differentValue))
        return handelUnError(handelUndefined(ValuesNotSame[lang]), ...arr);
};
export default new Rule(/^different:(.+)/gi, different);
