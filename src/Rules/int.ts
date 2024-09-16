import Rule, { MessagesStore } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
import { isNumber } from "@/utils/types";
export const Messages: MessagesStore<unknown> = {
  en: "the input value is not a number",
};

export default new Rule<"integer", typeof Messages, number>(
  "integer",
  (value, data, path, input, lang, errors) => {
    return isNumber(value)
      ? undefined
      : handelMessage(errors[lang], value, data, path, input, lang);
  },
  Messages
);
