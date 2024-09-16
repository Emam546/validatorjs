import Rule from "@/Rule";
import { getAllValues, getValue } from "@/utils/getValue";
import handelMessage from "@/utils/handelMessage";
import Messages from "./Messages/valueNotExist";
import { objectKeys } from "@/utils";
export { default as ValueNotExist } from "./Messages/valueNotExist";
export function getRequiredValues(
  inputs: unknown,
  path: string
): Array<{
  finalPath: string;
  element: unknown;
  curVal: unknown;
  Ppath: string;
}> {
  const ObjectPath = path.split(".").slice(0, -1).join(".");
  const allObjects = getAllValues(inputs, ObjectPath);
  const Ppath = path.split(".").at(-1) as string;

  return objectKeys(allObjects).reduce<
    Array<{
      finalPath: string;
      element: unknown;
      curVal: unknown;
      Ppath: string;
    }>
  >((acc, objPath) => {
    const element = allObjects[objPath];
    if (typeof element == "undefined" && !ObjectPath) return acc;
    const finalPath = objPath && objPath != "." ? objPath + "." + Ppath : Ppath;
    const curVal = getValue(element, Ppath);
    return [
      ...acc,
      {
        curVal,
        element,
        finalPath,
        Ppath,
      },
    ];
  }, []);
}
export default new Rule(
  "required",
  () => undefined,
  Messages,
  function required(inputs, data, path, lang, errors) {
    return getRequiredValues(inputs, path).reduce(
      (acc, { finalPath, curVal }) => {
        if (curVal === undefined) {
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
