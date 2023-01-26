import Rule, { InitSubmitFun, RuleFun, _Error } from "./Rule";
import LangTypes from "./types/lang";
export declare type RulesGetter = Array<string> | null;
export declare type Rules = Record<string, RulesGetter>;
export declare const TYPE_ARRAY: string[];
export declare type ValidatorOptions = {
    lang?: LangTypes;
};
export declare function parseRules(input: any): Rules;
export declare type constructorValidator<Input> = [
    Input,
    Rules,
    ValidatorOptions | undefined
];
export declare interface Validator<Input = any, Data = any> {
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
    getValue(path: string): any;
    getAllValues(path: string): Record<string, any>;
    setValue(path: string, value: any): boolean;
    setAllValues(path: string, value: any): Boolean[];
}
export declare class ValidatorClass<Input, Data> implements Validator<Input, Data> {
    inputs: Input;
    CRules: Rules;
    reqData: Data;
    options: ValidatorOptions;
    errors: Record<string, _Error[]>;
    inValidErrors: Record<string, _Error> | null;
    lang: LangTypes;
    static Rules: Rule[];
    readonly empty: boolean;
    constructor(inputs: Input, rules: Rules, reqData: Data, options?: ValidatorOptions);
    passes(): Promise<boolean>;
    getErrors(): Promise<Record<string, _Error[]> | null>;
    fails(): Promise<boolean>;
    _getSubmitErrors(): Promise<Record<string, _Error[]>>;
    _get_errors(inputs: any, path: string, rule: RulesGetter, addedPath?: string): Promise<Record<string, _Error[]>>;
    getValue(path: string): any;
    setValue(path: string, value: any): boolean;
    getAllValues(path: string): Record<string, any>;
    setAllValues(path: string, value: any): Boolean[];
    static parseRules: typeof parseRules;
    validAttr(): Data;
    inValidAttr(): import("./utils/inValidAttr").ReturnTypeUnMatch;
    inside(): boolean;
    validate(value: any, rule: string, path: string, expect?: [string]): Promise<_Error[]>;
    static register<Data = any>(name: RegExp | string, fun: RuleFun<Data>, initSubmit?: InitSubmitFun<Data>): Rule<Data>;
}
export default class S<Input = any, Data = any> extends ValidatorClass<Input, Data> {
    constructor(inputs: Input, rules: Rules, reqData?: Data, options?: ValidatorOptions);
}
