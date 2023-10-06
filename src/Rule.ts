/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type LangType from "./types/lang";
import { objectKeys } from "./utils";
import { isPromise, isString } from "./utils/types";
import { AllRules } from "@/Rules";

export type RuleFun<Data> = (
    value: unknown,
    name: string,
    validator: Validator<unknown, Data>,
    path: string,
    lang: LangType
) => string | undefined | Promise<string | undefined>;
export interface ErrorMessage {
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
) => Promise<Record<string, ErrorMessage[]>> | Record<string, ErrorMessage[]>;
export type RuleResponseType<
    T extends Rule<Name, unknown, Data>,
    Data,
    Name extends string
> = T extends Rule<Name, infer Res, Date> ? Res : never;
function isNoPromises(
    val: Array<
        Promise<Record<string, ErrorMessage[]>> | Record<string, ErrorMessage[]>
    >
): val is Array<Record<string, ErrorMessage[]>> {
    return !val.some((val) => isPromise(val));
}

export default class Rule<Name extends string, Res = unknown, Data = unknown> {
    private readonly name: Name | RegExp;
    private readonly fn: RuleFun<Data>;
    private readonly initFn?: InitSubmitFun<Data>;
    public static Rules: Rule<string, unknown>[] = Object.values({
        ...AllRules,
    });
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
    initSubmit(
        validator: Validator<unknown, Data>,
        lang: LangType
    ):
        | Record<string, ErrorMessage[]>
        | Promise<Record<string, ErrorMessage[]>> {
            
        const { CPaths: rules } = validator;
        if (!this.initFn) return {};
        const messages: Array<
            | Promise<Record<string, ErrorMessage[]>>
            | Record<string, ErrorMessage[]>
        > = [];
        objectKeys(rules).forEach((path) => {
            const arr = rules[path] as any;
            if (arr == null) return;
            if (!this.initFn) return {};

            for (let i = 0; i < arr.length; i++) {
                if (this.isequal(arr[i])) {
                    const message = (this.initFn as any)(
                        arr[i],
                        validator,
                        path,
                        lang
                    );

                    if (message != undefined) messages.push(message);
                }
            }
        });
        if (isNoPromises(messages))
            return messages.reduce(
                (acc, cur) => ({ ...acc, ...cur }),
                {} as Record<string, ErrorMessage[]>
            );
        return new Promise((res) => {
            Promise.all(messages.map(async (val) => await val)).then(
                (messages) =>
                    res(
                        messages.reduce(
                            (acc, cur) => ({ ...acc, ...cur }),
                            {} as Record<string, ErrorMessage[]>
                        )
                    )
            );
        });
    }
}
