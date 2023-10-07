import Rule, { ErrorMessage } from "@/Rule";
import compare from "@/utils/compare";
import handelUndefined from "@/utils/handelUndefined";
import handelUnError from "@/utils/handelUnError";
import ValueNotExist from "./Messages/valueNotExist";
import ValuesNotSame from "./Messages/ValuesNotSame";
import { getAllValues, getValue } from "@/utils/getValue";
import { ObjectEntries } from "@/utils";

export default new Rule(
    "confirm",
    () => undefined,
    function (...arr) {
        const [input, , path, lang] = arr;

        return ObjectEntries(getAllValues(input, path))
            .map<[string, string, unknown] | undefined>(([path, value]) => {
                const returnedValue = getValue(input, path + "_confirmation");
                if (returnedValue == undefined)
                    return [
                        path,
                        handelUnError(
                            handelUndefined(ValueNotExist[lang]),
                            ...arr
                        ) as string,
                        value,
                    ];
                if (!compare(value, returnedValue))
                    return [
                        path,
                        handelUnError(
                            handelUndefined(ValuesNotSame[lang]),
                            ...arr
                        ) as string,
                        value,
                    ];
                return undefined;
            })
            .reduce<Record<string, ErrorMessage>>((cur, val) => {
                if (val)
                    return {
                        ...cur,
                        [val[0]]: { message: val[1], value: val[2] },
                    };
                return cur;
            }, {});
    }
);
