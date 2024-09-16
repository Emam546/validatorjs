import type LangType from "./types/lang";
import { objectKeys } from "./utils";
import { isPromise, isString } from "./utils/types";
export type EqualFun<Data> = (val: unknown) => val is Data;
export type ErrorsType<Data> =
    | { [name: string]: ErrorsType<Data> }
    | MessagesStore<Data>;
export type RuleFun<Data, Errors extends ErrorsType<Data>> = (
    value: unknown,
    data: Data,
    path: string,
    input: unknown,
    lang: LangType,
    errors: Errors
) => string | undefined | Promise<string | undefined>;
export interface ErrorMessage {
    value: unknown;
    message: string;
}
export type GetMessageFun<Data> = (
    value: unknown,
    data: Data,
    path: string,
    input: unknown,
    lang: LangType
) => string;
export type StoredMessage<Data> = string | GetMessageFun<Data>;
export type MessagesStore<Data> = Partial<
    Record<LangType, StoredMessage<Data>>
>;

export type InitSubmitFun<Data, Errors extends ErrorsType<Data>> = (
    input: unknown,
    data: Data,
    path: string,
    lang: LangType,
    errors: Errors
) => Promise<Record<string, ErrorMessage>> | Record<string, ErrorMessage>;

function isNoPromises(
    val: Array<
        Promise<Record<string, ErrorMessage>> | Record<string, ErrorMessage>
    >
): val is Array<Record<string, ErrorMessage>> {
    return !val.some((val) => isPromise(val));
}

export default class Rule<
    Data,
    Errors extends ErrorsType<Data> = MessagesStore<Data>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    G = never
> {
    readonly errors: Errors;
    private readonly eq: Data extends string ? Data : EqualFun<Data>;
    private readonly fn: RuleFun<Data, Errors>;
    private readonly initFn?: InitSubmitFun<Data, Errors>;
    constructor(
        eq: Data extends string ? Data : EqualFun<Data>,
        fn: RuleFun<Data, Errors>,
        errors: Errors,
        initFn?: InitSubmitFun<Data, Errors>
    ) {
        this.eq = eq;
        this.fn = fn;
        this.initFn = initFn;
        this.errors = errors;
    }
    isequal(value: unknown): value is Data {
        if (isString(this.eq)) return value === this.eq;
        return this.eq(value);
    }
    validate(...arr: Parameters<RuleFun<Data, Errors>>) {
        return this.fn(...arr);
    }
    initSubmit(
        rules: Record<string, unknown[]>,
        input: unknown,
        errors: Errors,
        lang: LangType
    ) {
        if (typeof this.initFn == "undefined") return {};
        const messages = objectKeys(rules).reduce<
            Array<
                | Promise<Record<string, ErrorMessage>>
                | Record<string, ErrorMessage>
            >
        >((cur, path) => {
            const arr = rules[path];
            if (arr == null) return cur;
            if (typeof this.initFn == "undefined") return cur;
            for (let i = 0; i < arr.length; i++) {
                const val = arr[i];
                if (this.isequal(val)) {
                    const message = this.initFn(input, val, path, lang, errors);
                    cur.push(message);
                }
            }
            return cur;
        }, []);
        if (isNoPromises(messages))
            return messages.reduce<Record<string, ErrorMessage>>((acc, cur) => {
                objectKeys(cur).forEach((key) => {
                    acc[key] = cur[key];
                });
                return acc;
            }, {});
        return new Promise<Record<string, ErrorMessage>>((res, rej) => {
            Promise.all(messages.map(async (val) => await val))
                .then((messages) =>
                    res(
                        messages.reduce<Record<string, ErrorMessage>>(
                            (acc, cur) => {
                                objectKeys(cur).forEach((key) => {
                                    acc[key] = cur[key];
                                });
                                return acc;
                            },
                            {}
                        )
                    )
                )
                .catch(rej);
        });
    }
}
