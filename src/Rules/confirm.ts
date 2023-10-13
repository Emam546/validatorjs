import Rule, { ErrorMessage } from "@/Rule";
import compare from "@/utils/compare";
import ValueNotExist from "./Messages/valueNotExist";
import ValuesNotSame from "./Messages/ValuesNotSame";
import { getAllValues, getValue } from "@/utils/getValue";
import { ObjectEntries } from "@/utils";
import handelMessage from "@/utils/handelMessage";

export { default as ValueNotExist } from "./Messages/valueNotExist";
export { default as ValuesNotSame } from "./Messages/ValuesNotSame";

export default new Rule(
    "confirm",
    () => undefined,
    {
        notExist: ValueNotExist,
        notSame: ValuesNotSame,
    },
    function (input, data, path, lang, errors) {
        return ObjectEntries(getAllValues(input, path))
            .map<[string, string, unknown] | undefined>(([path, value]) => {
                const returnedValue = getValue(input, path + "_confirmation");
                if (returnedValue == undefined)
                    return [
                        path,
                        handelMessage(
                            errors.notExist[lang],
                            value,
                            data,
                            path,
                            input,
                            lang
                        ),
                        value,
                    ];
                if (!compare(value, returnedValue))
                    return [
                        path,
                        handelMessage(
                            errors.notSame[lang],
                            value,
                            data,
                            path,
                            input,
                            lang
                        ),
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
