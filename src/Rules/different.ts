import Rule, { ErrorMessage } from "@/Rule";

import compare, { hasOwnProperty } from "@/utils/compare";
import ValuesNotSame from "./Messages/ValuesNotSame";
import { isString } from "@/utils/types";
import { ObjectEntries } from "@/utils";
import { getAllValues, getValue } from "@/utils/getValue";
import handelMessage from "@/utils/handelMessage";
export default new Rule<{ different: string }>(
    (val: unknown): val is { different: string } => {
        return hasOwnProperty(val, "different") && isString(val.different);
    },
    () => undefined,
    function (...arr) {
        const [input, data, path, lang] = arr;
        const allPaths = path.split(".");
        const orgPath = allPaths[allPaths.length - 1];
        const differentPath =
            allPaths.length > 1
                ? allPaths.slice(0, allPaths.length - 1).join(".")
                : ".";

        return ObjectEntries(getAllValues(input, differentPath)).reduce<
            Record<string, ErrorMessage>
        >((acc, [path, value]) => {
            const differentValue = getValue(value, data.different);
            const orgValue = getValue(value, orgPath);
            if (compare(orgValue, differentValue))
                acc[path && path != "." ? path + "." + orgPath : orgPath] = {
                    message: handelMessage(ValuesNotSame[lang], ...arr),
                    value: orgValue,
                };
            return acc;
        }, {});
    }
);
