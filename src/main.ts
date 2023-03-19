import { isArray, isObject } from "./utils/types";
import Rule, { InitSubmitFun, RuleFun, _Error } from "./Rule";
import * as r from "./Rules";
import LangTypes from "./types/lang";
import UnMatchedType from "./lang/notMatch";
import { is_Rule } from "./utils/isRule";
import arrayKind from "./utils/arrayKind";
import { getValue, getAllValues } from "./utils/getValue";
import validAttr from "./utils/validAttr";
import compare, { hasOwnProperty } from "./utils/compare";
import inValidAttr from "./utils/inValidAttr";
import isEmpty from "./utils/isEmpty";
import { setAllValues, setValue } from "./utils/setValue";

export type RulesGetter = Array<string> | null;
export type Rules = Record<string, RulesGetter>;
export const TYPE_ARRAY = ["object", "array"];
export type ValidatorOptions = {
    lang?: LangTypes;
};

export function parseRules(input: unknown): Rules {
    //just parse rules from the object
    //it must alway finishes with
    // - array of string  that describes rules
    // - string that split with | sign
    const flattened: Rules = {};
    const _get_rule = (rules: unknown, property?: string) => {
        if (isArray(rules)) {
            // if there is added property before add .
            const p = property ? property + ".*" : "*";
            if (rules.length) {
                //get the type of the array
                // - array of rules
                // - array that describes a rules of the object or array
                if (is_Rule(rules))
                    //check if it is array that describes some rule
                    flattened[property || "."] = rules;
                else if (
                    isArray<string>(rules) &&
                    rules.length &&
                    rules.length <= 3
                ) {
                    //get array rules and continue in parsing object
                    _get_rule(rules[0], p + arrayKind(rules));
                    if (rules[2] && isArray(rules)) {
                        _get_rule(rules[2], property);
                    }
                } else
                    throw new Error(
                        `${rules.toString()} is not a valid rule input`
                    );
            } else flattened[p] = null;
        } else if (rules != undefined) {
            for (const prop in rules) {
                if (!hasOwnProperty(rules, prop)) continue;
                const rule = rules[prop];
                let p;
                if (prop == ".") p = property ? property : prop;
                else p = property ? property + "." + prop : prop;

                switch (typeof rule) {
                    case "string":
                        flattened[p] = rule.split("|") as RulesGetter;
                        break;
                    case "object":
                        if (rule === null) flattened[p] = rule;
                        else _get_rule(rule, p);
                }
            }
        }
    };
    _get_rule(input);
    return flattened;
}
export declare type constructorValidator<Input> = [
    Input,
    Rules,
    ValidatorOptions | undefined
];

export declare interface Validator<Input = unknown, Data = unknown> {
    reqData: Data;
    inputs: Input;
    CRules: Rules;
    options: ValidatorOptions;
    errors: Record<string, _Error[]>;
    inValidErrors: Record<string, _Error> | null;
    lang: LangTypes;
    passes(): Promise<boolean>;
    fails(): Promise<boolean>;
    getErrors(): Promise<Record<string, _Error[]> | null>;
    inside(): boolean;
    validAttr(): Data;
    getValue(path: string): unknown;
    getAllValues(path: string): Record<string, unknown>;
    setValue(path: string, value: unknown): boolean;
    setAllValues(path: string, value: unknown): boolean[];
}

export class ValidatorClass<Input, Data> implements Validator<Input, Data> {
    inputs: Input;
    CRules: Rules;
    reqData: Data;
    options: ValidatorOptions;
    errors: Record<string, _Error[]> = {};
    inValidErrors: Record<string, _Error> | null = null;
    public lang: LangTypes = "en";
    public static Rules: Rule<any, any>[];
    public readonly empty: boolean;
    constructor(
        inputs: Input,
        rules: Rules,
        reqData: Data,
        options?: ValidatorOptions
    ) {
        this.inputs = inputs;
        this.CRules = rules;
        this.options = options || {};
        this.reqData = reqData;
        this.empty = isEmpty(inputs);
        if (options) this.lang = options.lang || this.lang;
    }
    async passes(): Promise<boolean> {
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
                this.CRules[path]
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
        const validations: Promise<_Error[]>[] = [];
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
                            message: UnMatchedType(currentObj, this, currPath),
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
        (await Promise.all(validations)).forEach((result, i) => {
            const path = addPaths[i];
            if (result.length)
                if (!Errors[addedPath + path])
                    Errors[addedPath + path] = result;
                else Errors[addedPath + path].push(...result);
        });
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
    validAttr(): Data {
        return validAttr(this.inputs, this.CRules) as Data;
    }
    inValidAttr() {
        return (this.inValidErrors = inValidAttr(this.inputs, this.CRules));
    }
    inside() {
        return compare(this.validAttr(), this.inputs);
    }

    async validate(
        value: unknown,
        rule: string,
        path: string,
        expect?: [string]
    ): Promise<_Error[]> {
        let has = false;
        const arrMess: _Error[] = [];
        for (let i = 0; i < ValidatorClass.Rules.length; i++) {
            const ele = ValidatorClass.Rules[i];
            if (
                ele.isequal(rule) &&
                !(expect && !expect.some((rul) => ele.isequal(rul)))
            ) {
                has = true;
                const message = await ele.validate(
                    value,
                    rule,
                    this,
                    path,
                    this.lang
                );
                if (message)
                    arrMess.push({
                        value,
                        message,
                    });
            }
        }
        if (!has) throw new Error(`THE RULE ${rule} IS NOT EXIST`);
        return arrMess;
    }
    static register<Data>(
        name: RegExp | string,
        fun: RuleFun<Data, unknown>,
        initSubmit?: InitSubmitFun<Data, unknown>
    ): Rule<Data, unknown> {
        const rule = new Rule<Data, unknown>(name, fun, initSubmit);
        ValidatorClass.Rules.push(rule);
        return rule;
    }
}
export default class S<Input = unknown, Data = unknown> extends ValidatorClass<
    Input,
    Data
> {
    constructor(
        inputs: Input,
        rules: Rules,
        reqData?: Data,
        options?: ValidatorOptions
    ) {
        super(inputs, rules, reqData as Data, options);
    }
}

ValidatorClass.Rules = Object.values({ ...r });
