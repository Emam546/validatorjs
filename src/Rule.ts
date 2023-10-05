import { RulesGetter } from "./parseRules";
import LangType from "./types/lang";
import { isString } from "./utils/types";
export type RuleFun<Data> = (
    value: unknown,
    name: string,
    validator: Validator<unknown, Data>,
    path: string,
    lang: LangType
) => string | undefined | Promise<string | undefined>;
export interface _Error {
    value: unknown;
    message: string;
}
export type GetMessageFun<Data> = (
    value: unknown,
    name: string,
    validator: Validator<unknown, Data>,
    path: string,
    lang: LangType
) => string;
export type StoredMessage<Data> = string | GetMessageFun<Data>;
export type MessagesStore<Data> = Partial<
    Record<LangType, StoredMessage<Data>>
>;

export type InitSubmitFun<Data> = (
    name: string,
    validator: Validator<unknown, Data>,
    path: string,
    lang: LangType
) => Promise<Record<string, _Error[]>> | Record<string, _Error[]>;
export type RuleResponseType<
    T extends Rule<Name, unknown, Data>,
    Data,
    Name extends string
> = T extends Rule<Name, infer Res, Date> ? Res : never;
export default class Rule<Name extends string, Res = unknown, Data = unknown> {
    private readonly name: Name | RegExp;
    private readonly fn: RuleFun<Data>;
    private readonly initFn?: InitSubmitFun<Data>;
    constructor(
        name: Name | RegExp,
        fn: RuleFun<Data>,
        initFn?: InitSubmitFun<Data>
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
    validate(
        value: unknown,
        name: string,
        validator: Validator<unknown, Data>,
        path: string,
        lang: LangType
    ) {
        return this.fn(value, name, validator, path, lang);
    }
    async initSubmit(
        validator: Validator<unknown, Data>,
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
