import LangType from "./types/lang";
import { Validator } from "./index";
import { isString } from "./utils/types";
import { RulesGetter } from "./Rules";

export type RuleFun<Data> = (
    value: unknown,
    name: string,
    validator: Validator<Data>,
    path: string,
    lang: LangType
) => string | undefined | Promise<string | undefined>;
export interface _Error {
    value: unknown;
    message: string;
}
export type GetMessageFun = (
    value: unknown,
    name: string,
    validator: Validator,
    path: string,
    lang: LangType
) => string;
export type StoredMessage = string | GetMessageFun;
export type MessagesStore = Partial<Record<LangType, StoredMessage>>;

export type InitSubmitFun<Data> = (
    name: string,
    validator: Validator<Data>,
    path: string,
    lang: LangType
) => Promise<Record<string, _Error[]>> | Record<string, _Error[]>;
export type RuleResponseType<
    T extends Rule<Data, Name>,
    Data,
    Name extends RegExp | string
> = T extends Rule<Date, Name, infer Res> ? Res : never;
export default class Rule<Data, Name extends RegExp | string, Res = unknown> {
    private readonly name: Name;
    private readonly fn: RuleFun<Data>;
    private readonly initFn?: InitSubmitFun<Data>;
    constructor(name: Name, fn: RuleFun<Data>, initFn?: InitSubmitFun<Data>) {
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
    validate(
        value: unknown,
        name: string,
        validator: Validator<Data>,
        path: string,
        lang: LangType
    ) {
        return this.fn(value, name, validator, path, lang);
    }
    async initSubmit(
        validator: Validator<Data>,
        lang: LangType
    ): Promise<Record<string, _Error[]>> {
        const { CRules: rules } = validator;
        if (!this.initFn) return {};
        let returnedErrors: Record<string, _Error[]> = {};
        for (const path in rules) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const arr = (rules as any)[path] as RulesGetter;
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
