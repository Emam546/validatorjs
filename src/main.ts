/* eslint-disable @typescript-eslint/no-explicit-any */
import { isArray, isObject, isPromise, isString } from "@/utils/types";
import {
    isValidInput,
    InputRules,
    PathRules,
    RulesNames,
    ValidTypes,
    is_Rule,
    RulesGetter,
} from "@/type";
import type {
    InitSubmitFun,
    RuleFun,
    ErrorMessage,
    EqualFun,
    ErrorsType,
} from "@/Rule";
import Rule from "@/Rule";
import LangTypes from "@/types/lang";
import { getValue, getAllValues } from "@/utils/getValue";
import validAttr from "@/utils/validAttr";
import compare, { hasOwnProperty } from "@/utils/compare";
import { InvalidPath, UnMatchedType } from "@/utils/inValidAttr";
import handelMessage from "@/utils/handelMessage";
import { checkRules, extractRulesPaths } from "@/parseRules";
import { ObjectEntries, objectKeys, objectValues } from "@/utils";
import { AllRules } from "@/Rules";

export type ValidatorOptions = {
    lang?: LangTypes;
};
export type SuccessState<T> =
    | {
          state: true;
          data: ValidTypes<T>;
      }
    | { state: false; errors: Record<string, ErrorMessage[]> };
export default class ValidatorClass<T extends InputRules> {
    rules: T;
    CPaths: PathRules<T>;
    defaultoptions: ValidatorOptions;
    public lang: LangTypes = "en";
    public static Rules: Rule<any, any>[] = objectValues(AllRules);
    constructor(rules: T, options?: ValidatorOptions) {
        if (!checkRules(rules))
            throw new Error(
                "The rules is not extended from the INput Rules type"
            );
        this.rules = rules;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        this.CPaths = (extractRulesPaths as any)(rules);
        this.defaultoptions = options || { lang: "en" };
    }
    async asyncPasses(inputs: unknown): Promise<SuccessState<T>> {
        const errors = await this.asyncGetErrors(inputs);
        const state = Object.keys(errors).length === 0;
        if (state)
            return {
                state: true,
                data: inputs as ValidTypes<T>,
            };
        return {
            state: false,
            errors,
        };
    }

    passes(inputs: unknown): SuccessState<T> {
        const errors = this.getErrors(inputs);
        const state = Object.keys(errors).length === 0;
        if (state)
            return {
                state: true,
                data: inputs as ValidTypes<T>,
            };
        return {
            state: false,
            errors,
        };
    }
    getErrors(inputs: unknown): Record<string, ErrorMessage[]> {
        //Just object of paths and Errors description
        const Errors: Record<string, ErrorMessage[]> = this._getSubmitErrors(
            inputs
        )
            .filter<Record<string, ErrorMessage>>(
                (val): val is Record<string, ErrorMessage> => !isPromise(val)
            )
            .reduce<Record<string, ErrorMessage[]>>((acc, val) => {
                ObjectEntries(val).forEach(([key, val]) => {
                    if (acc[key]) acc[key].push(val);
                    else acc[key] = [val];
                });
                return acc;
            }, {});
        return ObjectEntries(
            this._get_errors(inputs, this.rules, inputs, "")
        ).reduce((acc, [key, errors]) => {
            const arr = errors.filter(
                (val): val is ErrorMessage =>
                    !isPromise(val) && typeof val != "undefined"
            );
            if (!arr.length) return acc;
            return { ...acc, [key]: arr };
        }, Errors);
    }
    async asyncGetErrors(
        inputs: unknown
    ): Promise<Record<string, ErrorMessage[]>> {
        const Errors: Record<string, ErrorMessage[]> = (
            await Promise.all(
                this._getSubmitErrors(inputs).map(async (val) => {
                    return await val;
                })
            )
        ).reduce<Record<string, ErrorMessage[]>>((acc, val) => {
            ObjectEntries(val).forEach(([key, val]) => {
                if (acc[key]) acc[key].push(val);
                else acc[key] = [val];
            });
            return acc;
        }, {});

        const r = this._get_errors(inputs, this.rules, inputs, "");
        const farr: [string, Promise<ErrorMessage | undefined>[]][] = [];

        objectKeys(r).forEach((key) => {
            const narr: Promise<ErrorMessage | undefined>[] = [];
            const arr = r[key].filter((val) => {
                if (isPromise(val)) {
                    narr.push(val);
                    return false;
                }
                return true;
            }) as ErrorMessage[];
            if (narr) farr.push([key, narr]);
            Errors[key] = arr;
        }, {} as Record<string, ErrorMessage[]>);
        await Promise.all(
            farr.map(async ([key, prom]) => {
                const val = await Promise.all(prom);
                const narr = val.filter((val) => val) as ErrorMessage[];
                Errors[key] = narr;
            })
        );

        return Errors;
    }
    private _getSubmitErrors(
        inputs: unknown
    ): Array<
        Record<string, ErrorMessage> | Promise<Record<string, ErrorMessage>>
    > {
        return ValidatorClass.Rules.reduce<
            Array<
                | Record<string, ErrorMessage>
                | Promise<Record<string, ErrorMessage>>
            >
        >((acc, rule) => {
            const res = rule.initSubmit(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                (this as any).CPaths as Record<string, RulesGetter>,
                inputs,
                rule.errors,
                this.lang
            );
            return [...acc, res];
        }, []);
    }
    private _get_errors(
        input: unknown,
        rules: InputRules,
        allInput: unknown,
        addedPath: string
    ): Record<string, Array<Promise<ErrorMessage | undefined> | ErrorMessage>> {
        const curPath = addedPath || ".";
        if (isString(rules)) rules = rules.split("|") as RulesNames[];
        if (is_Rule(rules)) {
            if (!rules) return {};
            const res = rules
                .map((rule) =>
                    this._validateInput(input, rule, allInput, curPath)
                )
                .filter(
                    (
                        rule
                    ): rule is
                        | Promise<ErrorMessage | undefined>
                        | ErrorMessage => rule != undefined
                )
                .reduce<
                    Array<Promise<ErrorMessage | undefined> | ErrorMessage>
                >((acc, err) => [...acc, err], []);
            if (!res.length) return {};
            return {
                [curPath]: res,
            };
        }
        if (isValidInput(rules)) {
            const [rule1, _type, rule2] = rules;
            const state = !is_Rule(rule2) && rules != undefined;
            if (_type == "object") {
                if (!isObject(input))
                    return {
                        [curPath]: [
                            {
                                message: handelMessage(
                                    UnMatchedType[this.lang],
                                    input,
                                    { obj: input },
                                    curPath,
                                    allInput,
                                    this.lang
                                ),
                                value: input,
                            },
                        ],
                    };
                return ObjectEntries(input).reduce((acc, [path, val]) => {
                    const cPath =
                        addedPath && addedPath != "."
                            ? `${addedPath}.${path}`
                            : path;
                    if (rule2 && state && hasOwnProperty(rule2, path)) {
                        return {
                            ...acc,
                            ...this._get_errors(
                                val,
                                rule2[path],
                                allInput,
                                cPath
                            ),
                        };
                    }
                    return {
                        ...acc,
                        ...this._get_errors(
                            val,
                            rule1,
                            allInput,
                            `${addedPath}.${path}`
                        ),
                    };
                }, {});
            }
            if (!isArray(input))
                return {
                    [curPath]: [
                        {
                            message: handelMessage(
                                UnMatchedType[this.lang],
                                input,
                                { obj: input },
                                addedPath,
                                allInput,
                                this.lang
                            ),
                            value: input,
                        },
                    ],
                };
            return input.reduce<
                Record<
                    string,
                    Array<Promise<ErrorMessage | undefined> | ErrorMessage>
                >
            >((acc, val, i) => {
                const cPath =
                    addedPath && addedPath != "."
                        ? `${addedPath}.*${i}`
                        : `*${i}`;

                if (rule2 && state && hasOwnProperty(rule2, i)) {
                    return {
                        ...acc,
                        ...this._get_errors(val, rule2[i], allInput, cPath),
                    };
                }
                return {
                    ...acc,
                    ...this._get_errors(val, rule1, allInput, cPath),
                };
            }, {});
        }
        if (!isObject(input))
            return {
                [curPath]: [
                    {
                        message: handelMessage(
                            UnMatchedType[this.lang],
                            input,
                            { obj: input },
                            addedPath,
                            allInput,
                            this.lang
                        ),
                        value: input,
                    },
                ],
            };
        return ObjectEntries(input)
            .map(([key, val]) => {
                const fPath =
                    addedPath && addedPath != "." ? `${addedPath}.${key}` : key;
                if (!hasOwnProperty(rules, key))
                    return {
                        [fPath]: [
                            {
                                message: handelMessage(
                                    InvalidPath[this.lang],
                                    val,
                                    { obj: val },
                                    fPath,
                                    allInput,
                                    this.lang
                                ),
                                value: val,
                            },
                        ],
                    };
                if (key == ".") {
                    if (!rules["."]) return {};
                    return this._get_errors(
                        val,
                        rules["."],
                        allInput,
                        addedPath
                    );
                }

                return this._get_errors(val, rules[key], allInput, fPath);
            })
            .reduce((acc, val) => ({ ...acc, ...val }), {});
    }
    static getValue = getValue;
    static getAllValues<T, P extends keyof PathRules<T>>(
        inputs: unknown,
        path: P
    ): Record<string, ValidTypes<PathRules<T>[P]>> {
        return getAllValues(inputs, path) as Record<
            string,
            ValidTypes<PathRules<T>[P]>
        >;
    }

    validAttr(inputs: unknown) {
        return validAttr(inputs, this.rules);
    }
    inside(inputs: unknown) {
        return compare(this.validAttr(inputs), inputs);
    }

    private _validateInput(
        value: unknown,
        data: RulesNames,
        allInput: unknown,
        path: string
    ): Promise<ErrorMessage | undefined> | ErrorMessage | undefined {
        for (let i = 0; i < ValidatorClass.Rules.length; i++) {
            const rule = ValidatorClass.Rules[i];
            if (rule.isequal(data)) {
                const message = rule.validate(
                    value,
                    data,
                    path,
                    allInput,
                    this.lang,
                    rule.errors
                );
                if (message instanceof Promise) {
                    return new Promise<ErrorMessage | undefined>((res, rej) => {
                        message
                            .then((message) => {
                                if (message) res({ value, message });
                                else res(undefined);
                            })
                            .catch((err) => rej(err));
                    });
                } else if (isString(message))
                    return {
                        value,
                        message,
                    };
                return undefined;
            }
        }

        throw new Error(`THE RULE ${JSON.stringify(data)} IS NOT EXIST`);
    }
    validate(
        value: unknown,
        rule: RulesNames
    ): Promise<ErrorMessage | undefined> | ErrorMessage | undefined {
        return this._validateInput(value, rule, value, ".");
    }
    static extractRulesPaths = extractRulesPaths;
    static register<Data, Errors extends ErrorsType<Data>>(
        name: Data extends string ? Data : EqualFun<Data>,
        fun: RuleFun<Data, Errors>,
        errors: Errors,
        initSubmit?: InitSubmitFun<Data, Errors>
    ) {
        const rule = new Rule(name, fun, errors, initSubmit);
        ValidatorClass.Rules.push(rule);
        return rule;
    }
}
