import { ObjectEntries } from ".";
import { hasOwnProperty } from "./compare";
import { isArray, isObject } from "./types";

export function getAllValues(
    inputs: unknown,
    path: string,
    addedPath?: string
): Record<string, unknown> {
    const paths = path.split(".");
    const key = paths[0];
    const restPath = path.split(".").slice(1).join(".");

    if (key == "") {
        if (path == "" || path == ".") return { [addedPath || "."]: inputs };
        return getAllValues(inputs, restPath);
    }

    if (key.startsWith("*")) {
        if (isObject(inputs)) {
            return ObjectEntries(inputs).reduce<Record<string, unknown>>(
                (acc, [i, val]) => {
                    return {
                        ...acc,
                        ...ObjectEntries(
                            getAllValues(
                                val,
                                restPath,
                                addedPath && addedPath != "."
                                    ? `${addedPath}.${i}`
                                    : key
                            )
                        ).reduce<Record<string, unknown>>(
                            (acc, [key, val]) => ({ ...acc, [key]: val }),
                            {}
                        ),
                    };
                },
                {}
            );
        } else if (isArray(inputs))
            return inputs.reduce<Record<string, unknown>>((acc, val, i) => {
                return {
                    ...acc,
                    ...ObjectEntries(
                        getAllValues(
                            val,
                            restPath,
                            addedPath && addedPath != "."
                                ? `${addedPath}.*${i}`
                                : key
                        )
                    ).reduce<Record<string, unknown>>(
                        (acc, [key, val]) => ({ ...acc, [key]: val }),
                        {}
                    ),
                };
            }, {});
    }
    const newAdd = addedPath && addedPath != "." ? `${addedPath}.${key}` : key;

    return hasOwnProperty(inputs, key)
        ? getAllValues(inputs[key], restPath, newAdd)
        : {};
}
export function getValue(inputs: unknown, path: string): unknown {
    const paths = path.split(".");
    const key = paths[0];
    const restPath = path.split(".").slice(1).join(".");
    if (key == "") {
        if (path == "" || path == ".") return inputs;
        return getValue(inputs, restPath);
    }
    if (key.startsWith("*")) {
        const index = parseInt(key.slice(1));
        if (!isNaN(index) && hasOwnProperty(inputs, index)) {
            return getValue(inputs[index], restPath);
        }
        return undefined;
    }
    return hasOwnProperty(inputs, key)
        ? getValue(inputs[key], restPath)
        : undefined;
}
