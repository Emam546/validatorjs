import { ErrorMessage, GetMessageFun, MessagesStore } from "@/Rule";
import constructObj, { ExtractedRules } from "./constructObj";
import { isArray, isObject } from "./types";
import { InputRules, PathRules, isValidInput } from "@/type";
import LangTypes from "@/types/lang";
import handelMessage from "./handelMessage";
import { ObjectEntries } from ".";
import { hasOwnProperty } from "./compare";
export const InvalidPath: MessagesStore<{ obj: unknown }> = {
    en: "invalid path",
};
export const UnMatchedType: MessagesStore<{ obj: unknown }> = {
    en: "Unmatched type value",
};
export function unMatchedValues<T>(
    input: unknown,
    unMatchObj: ExtractedRules<T>,
    lang: LangTypes,
    addedPath = ""
): Record<string, ErrorMessage> {
    const arr: Parameters<GetMessageFun<{ obj: unknown }>> = [
        input,
        {
            obj: unMatchObj,
        },
        addedPath,
        lang,
    ];
    if (unMatchObj == null) return {};

    if (isArray(unMatchObj)) {
        const [rule, _type, rules2] = unMatchObj;
        const ExcludedName: (string | number)[] = [];
        let InitErrors: Record<string, ErrorMessage> = {};
        if (rules2 && isObject(rules2)) {
            InitErrors = ObjectEntries(rules2).reduce<
                Record<string, ErrorMessage>
            >((acc, [key, extraRule]) => {
                ExcludedName.push(key as string);
                if (!hasOwnProperty(input, key)) return acc;
                return {
                    ...acc,
                    ...unMatchedValues(
                        input[key],
                        extraRule as any,
                        lang,
                        `${addedPath}*${key as string}.`
                    ),
                };
            }, {});
        }
        if (_type == "object") {
            if (!isObject(input))
                return {
                    [addedPath]: {
                        message: handelMessage(UnMatchedType[lang], ...arr),
                        value: input,
                    },
                };

            return ObjectEntries(input)
                .filter(([key]) => !ExcludedName.includes(key))
                .reduce<Record<string, ErrorMessage>>(
                    (acc, [key, val]) => ({
                        ...acc,
                        ...unMatchedValues(
                            val,
                            rule,
                            lang,
                            `${addedPath}*${key}.`
                        ),
                    }),
                    InitErrors
                );
        }
        if (!isArray(input))
            return {
                [addedPath]: {
                    message: handelMessage(UnMatchedType[lang], ...arr),
                    value: input,
                },
            };
        return input.reduce<Record<string, ErrorMessage>>(
            (acc, val, key) => ({
                ...acc,
                ...(!ExcludedName.includes(key)
                    ? unMatchedValues(val, rule, lang, `${addedPath}${key}.`)
                    : {}),
            }),
            InitErrors
        );
    }

    return ObjectEntries(input as Record<string, unknown>).reduce(
        (acc, [key, val]) => {
            if (!hasOwnProperty(unMatchObj, key))
                return {
                    [`${addedPath}${key}`]: {
                        message: handelMessage(InvalidPath[lang], ...arr),
                        value: val,
                    },
                };
            return {
                ...acc,
                ...unMatchedValues(
                    val,
                    unMatchObj[key],
                    lang,
                    `${addedPath}${key}.`
                ),
            };
        },
        {}
    );
}
export default function <T extends InputRules>(
    input: unknown,
    rules: T,
    lang: LangTypes
): Record<string, ErrorMessage> {
    const RulesObj = constructObj(rules);
    return unMatchedValues(input, RulesObj, lang);
}
