/* eslint-disable @typescript-eslint/no-explicit-any */
import { isArray, isObject, isPromise, isString } from "@/utils/types";
import {
    isValidInput,
    InputRules,
    PathRules,
    RulesNames,
    ValidTypes,
    is_Rule,
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
import { ObjectEntries, objectKeys } from "@/utils";
import { AllRules } from "@/Rules";
import mergeObjects from "@/utils/merge";
export type ValidatorOptions = {
    errors: Partial<Validator.Errors>;
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
    public static lang: LangTypes = "en";
    public static Rules = AllRules;
    public errors: Validator.Errors;
    constructor(rules: T, options?: Partial<ValidatorOptions>) {
        if (!checkRules(rules))
            throw new Error(
                "The rules is not extended from the Input Rules type"
            );
        this.rules = rules;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        this.CPaths = (extractRulesPaths as any)(rules);

        this.defaultoptions = mergeObjects(
            {
                errors: {
                    unMatchedType: UnMatchedType,
                    invalidPath: InvalidPath,
                },
            },
            options
        );
        this.errors = this.defaultoptions.errors as Validator.Errors;
    }
    async asyncPasses(
        inputs: unknown,
        lang?: LangTypes
    ): Promise<SuccessState<T>> {
        const errors = await this.asyncGetErrors(inputs, lang);
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
    static setDefaultLang(lang: LangTypes) {
        ValidatorClass.lang = lang;
    }
    static getDefaultLang(lang: LangTypes) {
        return ValidatorClass.lang;
    }
    passes(inputs: unknown, lang?: LangTypes): SuccessState<T> {
        const errors = this.getErrors(inputs, lang);
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
    getErrors(
        inputs: unknown,
        lang?: LangTypes
    ): Record<string, ErrorMessage[]> {
        //Just object of paths and Errors description
        const Errors: Record<string, ErrorMessage[]> = this._getSubmitErrors(
            inputs,
            lang || ValidatorClass.lang
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
            this._get_errors(
                inputs,
                this.rules,
                inputs,
                "",
                lang || ValidatorClass.lang
            )
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
        inputs: unknown,
        lang?: LangTypes
    ): Promise<Record<string, ErrorMessage[]>> {
        const Errors: Record<string, ErrorMessage[]> = (
            await Promise.all(
                this._getSubmitErrors(inputs, lang || ValidatorClass.lang).map(
                    async (val) => {
                        return await val;
                    }
                )
            )
        ).reduce<Record<string, ErrorMessage[]>>((acc, val) => {
            ObjectEntries(val).forEach(([key, val]) => {
                if (acc[key]) acc[key].push(val);
                else acc[key] = [val];
            });
            return acc;
        }, {});

        const r = this._get_errors(
            inputs,
            this.rules,
            inputs,
            "",
            lang || ValidatorClass.lang
        );
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
        inputs: unknown,
        lang: LangTypes
    ): Array<
        Record<string, ErrorMessage> | Promise<Record<string, ErrorMessage>>
    > {
        return ObjectEntries(ValidatorClass.Rules).reduce<
            Array<
                | Record<string, ErrorMessage>
                | Promise<Record<string, ErrorMessage>>
            >
        >((acc, [key, rule]) => {
            const res = rule.initSubmit(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                (this as any).CPaths as Record<string, unknown[]>,
                inputs,
                mergeObjects(rule.errors, this.errors[key]),
                lang
            );
            return [...acc, res];
        }, []);
    }
    private _get_errors(
        input: unknown,
        rules: InputRules,
        allInput: unknown,
        addedPath: string,
        lang: LangTypes
    ): Record<string, Array<Promise<ErrorMessage | undefined> | ErrorMessage>> {
        const curPath = addedPath || ".";
        if (isString(rules)) rules = rules.split("|") as RulesNames[];
        if (is_Rule(rules)) {
            if (!rules) return {};
            const res = rules
                .map((rule) =>
                    this._validateInput(input, rule, allInput, curPath, lang)
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
                                    this.errors["unMatchedType"][lang],
                                    input,
                                    { obj: input },
                                    curPath,
                                    allInput,
                                    lang
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
                                cPath,
                                lang
                            ),
                        };
                    }
                    return {
                        ...acc,
                        ...this._get_errors(
                            val,
                            rule1,
                            allInput,
                            `${addedPath}.${path}`,
                            lang
                        ),
                    };
                }, {});
            }
            if (!isArray(input))
                return {
                    [curPath]: [
                        {
                            message: handelMessage(
                                this.errors["unMatchedType"][lang],
                                input,
                                { obj: input },
                                addedPath,
                                allInput,
                                lang
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
                        ...this._get_errors(
                            val,
                            rule2[i],
                            allInput,
                            cPath,
                            lang
                        ),
                    };
                }
                return {
                    ...acc,
                    ...this._get_errors(val, rule1, allInput, cPath, lang),
                };
            }, {});
        }
        if (!isObject(input))
            return {
                [curPath]: [
                    {
                        message: handelMessage(
                            this.errors["unMatchedType"][lang],
                            input,
                            { obj: input },
                            addedPath,
                            allInput,
                            lang
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
                                    this.errors["invalidPath"][lang],
                                    val,
                                    { obj: val },
                                    fPath,
                                    allInput,
                                    lang
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
                        addedPath,
                        lang
                    );
                }

                return this._get_errors(val, rules[key], allInput, fPath, lang);
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
        path: string,
        lang: LangTypes
    ): Promise<ErrorMessage | undefined> | ErrorMessage | undefined {
        const keys = objectKeys(ValidatorClass.Rules);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const rule = ValidatorClass.Rules[keys[i]];
            if (rule.isequal(data)) {
                const message = rule.validate(
                    value,
                    data as never,
                    path,
                    allInput,
                    lang,
                    mergeObjects(rule.errors, this.errors[key])
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
        rule: RulesNames,
        lang?: LangTypes
    ): Promise<ErrorMessage | undefined> | ErrorMessage | undefined {
        return this._validateInput(
            value,
            rule,
            value,
            ".",
            lang || ValidatorClass.lang
        );
    }
    static extractRulesPaths = extractRulesPaths;
    static register<Data, Errors extends ErrorsType<Data>>(
        key: keyof Validator.AvailableRules,
        name: Data extends string ? Data : EqualFun<Data>,
        fun: RuleFun<Data, Errors>,
        errors: Errors,
        initSubmit?: InitSubmitFun<Data, Errors>
    ) {
        const rule = new Rule(name, fun, errors, initSubmit);

        ValidatorClass.Rules = { ...ValidatorClass.Rules, [key]: rule };
        return rule;
    }
}
