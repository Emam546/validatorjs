/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import LangTypes from "@/types/lang";
import { MessagesStore } from "@/Rule";
export const message: MessagesStore<unknown> = {
    en: "the inserted data type is not matching with the object type",
};
export default function UnMatchedType(
    obj: unknown,
    path: string,
    lang: LangTypes
): string {
    const val = message[lang];
    if (val)
        if (typeof val == "string") return val;
        else val(obj, "Not matched error", path, lang);
    throw new Error("this language is not in not matching messages");
}
