import Rule from "@/Rule";
import { getValue } from "@/utils/getValue";
import { getRequiredValues, ValueNotExist as Messages } from "./required";
export { ValueNotExist as Messages } from "./required";
import { isArray } from "@/utils/types";
import { hasOwnProperty } from "@/utils/compare";
import handelMessage from "@/utils/handelMessage";

export const require_without = new Rule<{ required_without: Array<string> }>(
  (val: unknown): val is { required_without: Array<string> } => {
    return (
      hasOwnProperty(val, "required_without") && isArray(val.required_without)
    );
  },

  () => undefined,
  Messages,
  function require_without(inputs, data, path, lang, errors) {
    const vpaths = data.required_without;

    return getRequiredValues(inputs, path).reduce(
      (acc, { finalPath, curVal, element }) => {
        if (
          curVal == undefined &&
          vpaths.some((vpath) => getValue(element, vpath) === undefined)
        ) {
          return {
            ...acc,
            [finalPath]: {
              message: handelMessage(
                errors[lang],
                curVal,
                data,
                finalPath,
                inputs,
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
export const require_withoutAll = new Rule<{
  required_withoutAll: Array<string>;
}>(
  (val: unknown): val is { required_withoutAll: Array<string> } => {
    return (
      hasOwnProperty(val, "required_withoutAll") &&
      isArray(val.required_withoutAll)
    );
  },
  () => undefined,
  Messages,
  function _require_withoutAll(input, data, path, lang, errors) {
    const vpaths = data.required_withoutAll;
    return getRequiredValues(input, path).reduce(
      (acc, { curVal, element, finalPath }) => {
        if (
          curVal == undefined &&
          vpaths.every((vpath) => getValue(element, vpath) === undefined)
        ) {
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
