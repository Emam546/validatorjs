import { Validator } from "..";
import { MessagesStore } from "../Rule";
export const message: MessagesStore = {
    en: "the inserted data type is not matching with the object type",
};
export default function UnMatchedType(
    obj: any,
    validator: Validator,
    path: string
): string {
    const val = message[validator.lang];
    if (val)
        if (typeof val == "string") return val;
        else val(obj, "Not matched error", validator, path);
    throw new Error("this language is not in not matching messages");
}
