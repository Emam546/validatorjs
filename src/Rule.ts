import LangType from "./types/lang";
import { Validator } from "./index";
import { isString } from "./utils/types";

export type RuleFun<Data, T> = (
    value: T,
    name: string,
    validator: Validator<T, Data>,
    path: string,
    lang: LangType
) => string | undefined | Promise<string | undefined>;
export interface _Error {
    value: unknown;
    message: string;
}
export type GetMessageFun<T> = (
    value: T,
    name: string,
    validator: Validator,
    path: string,
    ...a: unknown[]
) => string;
export type StoredMessage<T> = string | GetMessageFun<T>;
export type MessagesStore<T> = Record<LangType, StoredMessage<T>>;
export type InitSubmitFun<Data, T> = (
    name: string,
    validator: Validator<T, Data>,
    path: string,
    lang: LangType
) => Promise<Record<string, _Error[]>> | Record<string, _Error[]>;
export default class Rule<Data, Input> {
    private readonly name: RegExp | string;
    private readonly fn: RuleFun<Data, Input>;
    private readonly initFn?: InitSubmitFun<Data, Input>;
    constructor(
        name: RegExp | string,
        fn: RuleFun<Data, Input>,
        initFn?: InitSubmitFun<Data, Input>
    ) {
        this.name = name;
        this.fn = fn;
        this.initFn = initFn;
    }
    isequal(value: string): boolean {
        if (isString(this.name) && this.name == value) return true;
        else if (this.name instanceof RegExp)
            return value.match(this.name) != null;
        return false;
    }
    async validate(
        value: Input,
        name: string,
        validator: Validator<Input, Data>,
        path: string,
        lang: LangType
    ): Promise<string | undefined> {
        return await this.fn(value, name, validator, path, lang);
    }

    async initSubmit(
        validator: Validator<Input, Data>,
        lang: LangType
    ): Promise<Record<string, _Error[]>> {
        const { CRules: rules } = validator;
        let returnedErrors: Record<string, _Error[]> = {};
        if (!this.initFn) return {};
        for (const path in rules) {
            const arr = rules[path];
            if (arr)
                for (let i = 0; i < arr.length; i++) {
                    if (this.isequal(arr[i])) {
                        const message = await this.initFn(
                            arr[i],
                            validator,
                            path,
                            lang
                        );
                        if (message != undefined)
                            returnedErrors = { ...returnedErrors, ...message };
                    }
                }
        }
        return returnedErrors;
    }
}
