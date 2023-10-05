/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { isArray, isObject, isString } from "./utils/types";
import Rule, { InitSubmitFun, RuleFun, _Error } from "./Rule";
import LangTypes from "./types/lang";
import UnMatchedType from "./lang/notMatch";
import { getValue, getAllValues } from "./utils/getValue";
import validAttr from "./utils/validAttr";
import compare from "./utils/compare";
import inValidAttr from "./utils/inValidAttr";
import isEmpty from "./utils/isEmpty";
import { setAllValues, setValue } from "./utils/setValue";
import { Rules, parseRules, RulesGetter, InputRules } from "./parseRules";
import { AllRules } from "./Rules";

export const TYPE_ARRAY = ["object", "array"];
export type ValidatorOptions = {
    lang?: LangTypes;
};

export default class ValidatorClass<T, Data>
    implements Validator<T, Data>
{
    inputs: unknown;
    CRules: Rules<T>;
    reqData: Data;
    options: ValidatorOptions;
    errors: Record<string, _Error[]> = {};
    inValidErrors: Record<string, _Error> | null = null;
    public lang: LangTypes = "en";
    public static Rules = Object.values({
        ...AllRules,
    });
    public readonly empty: boolean;
    constructor(
        inputs: unknown,
        rules: Rules<T>,
        reqData?: Data,
        options?: ValidatorOptions
    ) {
        this.inputs = inputs;
        this.CRules = rules;
        this.options = options || {};
        this.reqData = reqData as Data;
        this.empty = isEmpty(inputs);
        if (options) this.lang = options.lang || this.lang;
    }
    async passes() {
        //Just object of paths and there current objects
        return (await this.getErrors()) === null;
    }
    async getErrors(): Promise<Record<string, _Error[]> | null> {
        //Just object of paths and Errors description
        let Errors: Record<string, _Error[]> = {};

        for (const path in this.CRules) {
            const r = await this._get_errors(
                this.inputs,
                path,
                (this.CRules as any)[path]
            );
            // result = { ...result, ...r[0] };
            Errors = { ...Errors, ...r };
        }
        this.errors = Errors;

        if (Object.keys(Errors).length == 0) return null;
        return Errors;
    }
    async fails() {
        return !(await this.passes());
    }
    async _getSubmitErrors(): Promise<Record<string, _Error[]>> {
        let Result = {};
        for (let i = 0; i < ValidatorClass.Rules.length; i++) {
            const res = await ValidatorClass.Rules[i].initSubmit(
                this,
                this.lang
            );
            Result = { ...Result, ...res };
        }
        return Result;
    }

    async _get_errors(
        inputs: unknown,
        path: string,
        rule: RulesGetter,
        addedPath = ""
    ): Promise<Record<string, _Error[]>> {
        const paths = path.split(".");
        let currentObj = inputs;
        // let result: Record<string, any> = {};
        let Errors: Record<string, _Error[]> = await this._getSubmitErrors();
        const validations: Array<Promise<_Error | undefined> | _Error>[] = [];
        const addPaths: string[] = [];
        for (let i = 0; i < paths.length; i++) {
            if (paths[i].indexOf("*") == 0) {
                const currPath = addedPath + paths.slice(0, i).join(".");
                const [, type_]: Array<string> = paths[i].split(":");
                const oldPath = paths.slice(0, i).join(".");
                const newPath = paths.slice(i + 1).join(".");
                if (type_ == "array" && isArray(currentObj)) {
                    for (let i = 0; i < currentObj.length; i++) {
                        const r = await this._get_errors(
                            currentObj[i],
                            newPath,
                            rule,
                            `${addedPath}${oldPath}.*${i}${newPath ? "." : ""}`
                        );
                        Errors = { ...Errors, ...r };
                    }
                } else if (type_ == "object" && isObject(currentObj)) {
                    for (const key in currentObj) {
                        const r = await this._get_errors(
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
                        validations.push(
                            this.validate(
                                currentObj, //value
                                rule[i],
                                addedPath + path
                            )
                        );
                        addPaths.push(addedPath + path);
                    }
                }
            }
        }
        await Promise.all(
            validations.map(async (val, i) => {
                const path = addPaths[i];
                const result = (await Promise.all(val)).filter(
                    (res) => res != undefined
                ) as _Error[];
                if (result.length) {
                    if (!Errors[addedPath + path])
                        Errors[addedPath + path] = result;
                    else Errors[addedPath + path].push(...result);
                }
            })
        );
        return Errors;
    }
    getValue(path: string) {
        return getValue(this.inputs, path);
    }
    setValue(path: string, value: unknown): boolean {
        return setValue(this.inputs, path, value);
    }
    getAllValues(path: string) {
        return getAllValues(this.inputs, path);
    }
    setAllValues(path: string, value: unknown): boolean[] {
        return setAllValues(this.inputs, path, value);
    }
    static parseRules = parseRules;
    validAttr(): unknown {
        return validAttr(this.inputs, this.CRules);
    }
    inValidAttr() {
        return (this.inValidErrors = inValidAttr(this.inputs, this.CRules));
    }
    inside() {
        return compare(this.validAttr(), this.inputs);
    }

    validate(
        value: unknown,
        rule: string,
        path: string,
        expect?: [string]
    ): Array<Promise<_Error | undefined> | _Error> {
        let has = false;
        const arrMess: Array<Promise<_Error | undefined> | _Error> = [];
        for (let i = 0; i < ValidatorClass.Rules.length; i++) {
            const ele = ValidatorClass.Rules[i];
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
                        new Promise<_Error | undefined>((res, rej) => {
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
    static register<Name extends string, Data, Res = unknown>(
        name: Name | RegExp,
        fun: RuleFun<Data>,
        initSubmit?: InitSubmitFun<Data>
    ): Rule<Name, Res, Data> {
        const rule = new Rule<Name, Res, Data>(name, fun, initSubmit);
        ValidatorClass.Rules.push(rule as any);
        return rule;
    }
}
