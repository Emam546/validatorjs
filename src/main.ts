/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { isArray, isObject, isPromise, isString } from "@/utils/types";
import type { InitSubmitFun, RuleFun, ErrorMessage } from "@/Rule";
import Rule from "@/Rule";
import LangTypes from "@/types/lang";
import UnMatchedType from "@/lang/notMatch";
import { getValue, getAllValues } from "@/utils/getValue";
import validAttr from "@/utils/validAttr";
import compare from "@/utils/compare";
import inValidAttr from "@/utils/inValidAttr";
import isEmpty from "@/utils/isEmpty";
import { setAllValues, setValue } from "@/utils/setValue";
import type { Rules, ValidTypes } from "@/type";
import { parseRules } from "@/parseRules";
import { objectKeys } from "@/utils";
import { RulesGetter } from "@/type";

export const TYPE_ARRAY = ["object", "array"];
export type ValidatorOptions = {
    lang?: LangTypes;
};

export default class ValidatorClass<T, Data> implements Validator<T, Data> {
    inputs: unknown;
    CPaths: Rules<T>;
    reqData: Data;
    options: ValidatorOptions;
    errors: Record<string, ErrorMessage[]> = {};
    inValidErrors: Record<string, ErrorMessage> | null = null;
    public lang: LangTypes = "en";

    public readonly empty: boolean;
    constructor(
        inputs: unknown,
        rules: Rules<T>,
        reqData?: Data,
        options?: ValidatorOptions
    ) {
        this.inputs = inputs;
        this.CPaths = rules;
        this.options = options || {};
        this.reqData = reqData as Data;
        this.empty = isEmpty(inputs);
        if (options) this.lang = options.lang || this.lang;
    }
    asyncPasses(): boolean {
        throw new Error("Method not implemented.");
    }
    asyncFails(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    passes() {
        //Just object of paths and there current objects
        return this.getErrors() === null;
    }
    getErrors(): Record<string, ErrorMessage[]> | null {
        //Just object of paths and Errors description
        let Errors: Record<string, ErrorMessage[]> = this._getSubmitErrors()
            .filter((val) => !isPromise(val))
            .reduce((cur: Record<string, ErrorMessage[]>, val) => {
                if (!isPromise(val)) return { ...cur, ...val };
                return cur;
            }, {});

        for (const path in this.CPaths) {
            const r = this._get_errors(
                this.inputs,
                path,
                (this.CPaths as any)[path]
            );
            const newR = objectKeys(r).reduce((cur, key) => {
                const arr = r[key].filter(
                    (val) => !isPromise(val) && typeof val == "undefined"
                ) as ErrorMessage[];
                return { ...cur, [key]: arr };
            }, {} as Record<string, ErrorMessage[]>);
            // result = { ...result, ...r[0] };
            Errors = { ...Errors, ...newR };
        }
        this.errors = Errors;

        if (Object.keys(Errors).length == 0) return null;
        return Errors;
    }
    async asyncGetErrors(): Promise<Record<string, ErrorMessage[]> | null> {
        const Errors: Record<string, ErrorMessage[]> = (
            await Promise.all(
                this._getSubmitErrors().map(async (val) => {
                    return await val;
                })
            )
        ).reduce((cur, val) => {
            return { ...cur, ...val };
        }, {} as Record<string, ErrorMessage[]>);

        for (const path in this.CPaths) {
            const r = this._get_errors(
                this.inputs,
                path,
                (this.CPaths as any)[path]
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
        }
        this.errors = Errors;

        if (Object.keys(Errors).length == 0) return null;
        return Errors;
    }
    fails() {
        return this.passes();
    }

    _getSubmitErrors(): Array<
        Record<string, ErrorMessage[]> | Promise<Record<string, ErrorMessage[]>>
    > {
        let Result: Array<
            | Record<string, ErrorMessage[]>
            | Promise<Record<string, ErrorMessage[]>>
        > = [];
        for (let i = 0; i < Rule.Rules.length; i++) {
            const res = Rule.Rules[i].initSubmit(this, this.lang);
            Result = [...Result, res];
        }
        return Result;
    }

    _get_errors(
        inputs: unknown,
        path: string,
        rule: RulesGetter,
        addedPath = ""
    ): Record<string, Array<Promise<ErrorMessage | undefined> | ErrorMessage>> {
        const paths = path.split(".");
        let currentObj = inputs;
        // let result: Record<string, any> = {};
        let Errors: Record<
            string,
            Array<Promise<ErrorMessage | undefined> | ErrorMessage>
        > = {};

        const validations: Array<
            [string, Array<Promise<ErrorMessage | undefined> | ErrorMessage>]
        > = [];
        for (let i = 0; i < paths.length; i++) {
            if (paths[i].indexOf("*") == 0) {
                const currPath = addedPath + paths.slice(0, i).join(".");
                const [, type_]: Array<string> = paths[i].split(":");
                const oldPath = paths.slice(0, i).join(".");
                const newPath = paths.slice(i + 1).join(".");
                if (type_ == "array" && isArray(currentObj)) {
                    for (let i = 0; i < currentObj.length; i++) {
                        const r = this._get_errors(
                            currentObj[i],
                            newPath,
                            rule,
                            `${addedPath}${oldPath}.*${i}${newPath ? "." : ""}`
                        );
                        Errors = { ...Errors, ...r };
                    }
                } else if (type_ == "object" && isObject(currentObj)) {
                    for (const key in currentObj) {
                        const r = this._get_errors(
                            currentObj[key],
                            newPath,
                            rule,
                            `${addedPath}${oldPath}.${key}${newPath ? "." : ""}`
                        );
                        Errors = { ...Errors, ...r };
                    }
                } else {
                    Errors[addedPath + paths.slice(0, i).join(".")] = [
                        {
                            message: UnMatchedType(
                                currentObj,
                                this,
                                currPath,
                                this.lang
                            ),
                            value: currentObj,
                        },
                    ];
                    break;
                }
                //make _get_errors do the rest of work and break the loop
                break;
            } else if (isObject(currentObj)) {
                if (!Object.prototype.hasOwnProperty.call(currentObj, paths[i]))
                    break;
                currentObj = currentObj[paths[i]];
            } else if (i !== paths.length - 1)
                Errors[addedPath + paths.slice(0, i).join(".")] = [
                    {
                        value: currentObj,
                        message: "the current value is not a object",
                    },
                ];
            if (i === paths.length - 1) {
                if (rule) {
                    for (let i = 0; i < rule.length; i++) {
                        validations.push([
                            addedPath + path,
                            this.validate(
                                currentObj, //value
                                rule[i],
                                addedPath + path
                            ),
                        ]);
                    }
                }
            }
        }

        validations.forEach(([path, result]) => {
            if (result.length) {
                if (!Errors[addedPath + path])
                    Errors[addedPath + path] = result;
                else Errors[addedPath + path].push(...result);
            }
        });

        return Errors;
    }
    getValue(path: string) {
        return getValue(this.inputs, path);
    }
    setValue(path: string, value: unknown): boolean {
        return setValue(this.inputs, path, value);
    }
    getAllValues(path: string): Record<string, unknown> {
        return getAllValues(this.inputs, path);
    }
    setAllValues(path: string, value: unknown): boolean[] {
        return setAllValues(this.inputs, path, value);
    }
    validAttr() {
        return validAttr(this.inputs, this.CPaths);
    }
    inValidAttr() {
        return (this.inValidErrors = inValidAttr(this.inputs, this.CPaths));
    }
    inside() {
        return compare(this.validAttr(), this.inputs);
    }

    validate(
        value: unknown,
        rule: string,
        path: string,
        expect?: [string]
    ): Array<Promise<ErrorMessage | undefined> | ErrorMessage> {
        let has = false;
        const arrMess: Array<Promise<ErrorMessage | undefined> | ErrorMessage> =
            [];
        for (let i = 0; i < Rule.Rules.length; i++) {
            const ele = Rule.Rules[i];
            if (
                ele.isequal(rule) &&
                !(expect && !expect.some((rul) => ele.isequal(rul)))
            ) {
                has = true;
                const message = ele.validate(
                    value,
                    rule,
                    this,
                    path,
                    this.lang
                );
                if (message instanceof Promise) {
                    arrMess.push(
                        new Promise<ErrorMessage | undefined>((res, rej) => {
                            message
                                .then((message) => {
                                    if (message) res({ value, message });
                                    else res(undefined);
                                })
                                .catch((err) => rej(err));
                        })
                    );
                } else if (isString(message))
                    arrMess.push({
                        value,
                        message,
                    });
            }
        }
        if (!has) throw new Error(`THE RULE ${rule} IS NOT EXIST`);
        return arrMess;
    }
    static parseRules = parseRules;

    static register<Name extends string, Data, Res = unknown>(
        name: Name | RegExp,
        fun: RuleFun<Data>,
        initSubmit?: InitSubmitFun<Data>
    ): Rule<Name, Res, Data> {
        const rule = new Rule<Name, Res, Data>(name, fun, initSubmit);
        Rule.Rules.push(rule as any);
        return rule;
    }
}
