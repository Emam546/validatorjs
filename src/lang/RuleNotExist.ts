import { MessagesStore, RuleFun } from "@/Rule";
import LangTypes from "@/types/lang";
export const message: MessagesStore<unknown> = {
    en: (val) => `THE RULE ${val as string} IS NOT EXIST`,
};
export default function RuleIsNotExist(
    rule: string,
    path: string,
    lang: LangTypes
): string {
    const val = message[lang];
    if (val)
        if (typeof val == "string") return val;
        else val(rule, "Not matched error", path, lang);
    throw new Error("this language is not in not matching messages");
}
