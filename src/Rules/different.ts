import Rule, { ErrorMessage } from "@/Rule";

import compare, { hasOwnProperty } from "@/utils/compare";
import handelUndefined from "@/utils/handelUndefined";
import handelUnError from "@/utils/handelUnError";
import ValuesNotSame from "./Messages/ValuesNotSame";
import { isString } from "@/utils/types";
import { ObjectEntries } from "@/utils";
import { getAllValues, getValue } from "@/utils/getValue";
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
                acc[path + "." + orgPath] = {
                    message: handelUnError(
                        handelUndefined(ValuesNotSame[lang]),
                        ...arr
                    ) as string,
                    value: orgValue,
                };
            return acc;
        }, {});
    }
);
