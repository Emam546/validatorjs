import LangType from "./types/lang";
import { Validator } from "./index";
export declare type RuleFun<Data = any> = (value: any, name: string, validator: Validator<any, Data>, path: string, lang: LangType) => string | undefined | Promise<string | undefined>;
export interface _Error {
    value: any;
    message: string;
}
export declare type GetMessageFun = (value: any, name: string, validator: Validator, path: string, ...a: any[]) => string;
export declare type StoredMessage = string | GetMessageFun;
export declare type MessagesStore = Record<LangType, StoredMessage>;
export declare type InitSubmitFun<Data = any> = (name: string, validator: Validator<any, Data>, path: string, lang: LangType) => Record<string, _Error[]>;
export default class Rule<Data = any> {
    private readonly name;
    private readonly fn;
    private readonly initFn;
    constructor(name: RegExp | String, fn: RuleFun<Data>, initFn?: InitSubmitFun);
    isequal(value: string): boolean;
    validate(value: any, name: string, validator: Validator<any>, path: string, lang: LangType): Promise<string | undefined>;
    initSubmit(validator: Validator, lang: LangType): Promise<Record<string, _Error[]>>;
}
