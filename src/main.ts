import { isArray, isObject } from "./utils/types";
import Rule, { InitSubmitFun, RuleFun, _Error } from "./Rule";
import * as r from "./Rules";
import LangTypes from "./types/lang";
import _arrayRange from "./lang/minMaxErrors";
import UnMatchedType from "./lang/notMatch";
import { is_Rule } from "./utils/isRule";
import arrayKind from "./utils/arrayKind";
import { getValue, getAllValues } from "./utils/getValue";
import validAttr from "./utils/validAttr";
import compare from "./utils/compare";
import inValidAttr from "./utils/inValidAttr";
import isEmpty from "./utils/isEmpty";
export type RulesGetter = Array<string> | null;
export type Rules = Record<string, RulesGetter>;
export const TYPE_ARRAY = ["object", "array"];
export type ValidatorOptions = {
    lang?: LangTypes;
};

export function parseRules(input: any): Rules {
    //just parse rules from the object
    //it must alway finishes with
    // - array of string  that describes rules
    // - string that split with | sign
    const flattened: Rules = {};
    const _get_rule = (rules: any, property?: string) => {
        if (Array.isArray(rules)) {
            // if there is added property before add .
            const p = property ? property + ".*" : "*";
            if (rules.length) {
                //get the type of the array
                // - array of rules
                // - array that describes a rules of the object or array
                if (is_Rule(rules))
                    //check if it is array that describes some rule
                    flattened[property || "*:array"] = rules;
                else if (rules.length && rules.length <= 4)
                    //get array rules and continue in parsing object
                    _get_rule(rules[0] as any, p + arrayKind(rules));
                else throw new Error(`${rules} is not a valid rule input`);
            } else flattened[p] = null;
        } else {
            for (const prop in rules) {
                if (!Object.prototype.hasOwnProperty.call(rules, prop))
                    continue;
                const rule = rules[prop];
                const p = property ? property + "." + prop : prop;
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
export default class Validator {
    inputs: any;
    CRules: Rules;
    options: ValidatorOptions;
    errors: Record<string, _Error[]> = {};
    inValidErrors:Record<string,_Error>|null=null;
    public lang: LangTypes = "en";
    public static Rules: Rule[];
    public readonly empty:boolean;
    constructor(
        inputs: Record<string, any>,
        rules: Rules,
        options?: ValidatorOptions
    ) {
        this.inputs = inputs;
        this.CRules = rules;
        this.options = options || {};
        this.empty=isEmpty(inputs)
        if (options) this.lang = options.lang || this.lang;
    }
    async passes(): Promise<boolean> {
        //Just object of paths and there current objects
        return (await this.getErrors())===null
    }
    async getErrors():Promise<Record<string, _Error[]>|null>{
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

        if(Object.keys(Errors).length == 0)return null;
        return Errors
    }
    async fails() {
        return !(await this.passes());
    }
    async _getSubmitErrors(): Promise<Record<string, _Error[]>> {
        let Result = {};
        for (let i = 0; i < Validator.Rules.length; i++) {
            const res = await Validator.Rules[i].initSubmit(this, this.lang);
            Result = { ...Result, ...res };
        }
        return Result;
    }

    async _get_errors(
        inputs: any,
        path: string,
        rule: RulesGetter,
        addedPath: string = ""
    ): Promise<Record<string, _Error[]>> {
        const paths = path.split(".");
        let currentObj = inputs;
        // let result: Record<string, any> = {};
        let Errors: Record<string, _Error[]> = await this._getSubmitErrors();

        for (let i = 0; i < paths.length; i++) {
            if (paths[i].indexOf("*") == 0) {
                let currPath = addedPath + paths.slice(0, i).join(".");
                let [, type_, min, max]: Array<any> = paths[i].split(":");
                const oldPath = paths.slice(0, i + 1).join(".");
                min = parseInt(min) || 0;
                max = parseInt(max) || Infinity;
                const newPath = paths.slice(i + 1).join(".");
                if (type_ === "array" && isArray(currentObj)) {
                    for (let i = 0; i < currentObj.length; i++) {
                        const r = await this._get_errors(
                            currentObj[i],
                            newPath,
                            rule,
                            `${addedPath}${oldPath}.*${i}.`
                        );
                        // result = { ...result, ...r[0] };
                        Errors = { ...Errors, ...r };
                    }
                } else if (
                    type_ === "object" &&
                    !isArray(currentObj) &&
                    currentObj instanceof Object
                ) {
                    for (const key in currentObj) {
                        const r = await this._get_errors(
                            currentObj[key],
                            newPath,
                            rule,
                            `${addedPath}${oldPath}.${key}.`
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

                let ArrErrors;
                if (
                    (ArrErrors = _arrayRange(
                        min,
                        max,
                        currentObj,
                        "",
                        this,
                        currPath
                    ))
                )
                    Errors[currPath] = [
                        { message: ArrErrors, value: currentObj },
                    ];

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
                        const result = await this.validate(
                            currentObj, //value
                            rule[i],
                            addedPath + path
                        );
                        if (result.length)
                            if (!Errors[addedPath + path])
                                Errors[addedPath + path] = result;
                            else Errors[addedPath + path].push(...result);
                    }
                }
            }
        }
        return Errors;
    }
    getValue(path: string) {
        return getValue(this.inputs, path);
    }
    getAllValues(path: string) {
        return getAllValues(this.inputs, path);
    }
    static parseRules = parseRules;
    validAttr(): any {
        return validAttr(this.inputs, this.CRules);
    }
    inValidAttr() {
        return (this.inValidErrors=inValidAttr(this.inputs, this.CRules));
    }
    inside() {
        return compare(this.validAttr(), this.inputs);
    }
    
    async validate(
        value: any,
        rule: string,
        path: string,
        expect?: [string]
    ): Promise<_Error[]> {
        let has = false;
        const arrMess: _Error[] = [];
        for (let i = 0; i < Validator.Rules.length; i++) {
            const ele = Validator.Rules[i];
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
    static register(
        name: RegExp | string,
        fun: RuleFun,
        initSubmit?: InitSubmitFun
    ): Rule {
        const rule = new Rule(name, fun, initSubmit);
        Validator.Rules.push(rule);
        return rule;
    }
}
Validator.Rules = Object.values({ ...r });
