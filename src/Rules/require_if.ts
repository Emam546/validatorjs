import Rule, { MessagesStore } from "@/Rule";
import compare, { hasOwnProperty } from "@/utils/compare";
import { getValue } from "@/utils/getValue";
import { isString } from "@/utils/types";
import handelMessage from "@/utils/handelMessage";
import { getRequiredValues } from "./required";

export const Messages: MessagesStore<unknown> = {
  en: "the input value is not equal the another value",
};
export const require_if = new Rule<{
  required_if: { path: string; value: unknown };
}>(
  (val: unknown): val is { required_if: { path: string; value: unknown } } => {
    return (
      hasOwnProperty(val, "required_if") &&
      hasOwnProperty(val.required_if, "path") &&
      hasOwnProperty(val.required_if, "value") &&
      isString(val.required_if.path)
    );
  },
  () => undefined,
  Messages,
  function _require_if(input, data, path, lang, errors) {
    const vpath = data.required_if.path;

    return getRequiredValues(input, path).reduce(
      (acc, { curVal, finalPath, element }) => {
        const val = getValue(element, vpath);
        if (compare(val, data.required_if.value) && curVal == undefined) {
          return {
            ...acc,
            [finalPath]: {
              message: handelMessage(
                errors[lang],
                curVal,
                data,
                finalPath,
                input,
                lang
              ),
              value: curVal,
            },
          };
        }
        return acc;
      },
      {}
    );
  }
);
export const require_unless = new Rule<{
  require_unless: { path: string; value: unknown };
}>(
  (
    val: unknown
  ): val is { require_unless: { path: string; value: unknown } } => {
    return (
      hasOwnProperty(val, "require_unless") &&
      hasOwnProperty(val.require_unless, "path") &&
      hasOwnProperty(val.require_unless, "value") &&
      isString(val.require_unless.path)
    );
  },
  () => undefined,
  Messages,
  function _require_unless(input, data, path, lang, errors) {
    const vpath = data.require_unless.path;
    return getRequiredValues(input, path).reduce(
      (acc, { curVal, element, finalPath }) => {
        const val = getValue(element, vpath);
        if (!compare(val, data.require_unless.value) && curVal == undefined) {
          return {
            ...acc,
            [finalPath]: {
              message: handelMessage(
                errors[lang],
                curVal,
                data,
                finalPath,
                input,
                lang
              ),
              value: curVal,
            },
          };
        }
        return acc;
      },
      {}
    );
  }
);
