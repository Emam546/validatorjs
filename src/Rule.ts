/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type LangType from "./types/lang";
import { objectKeys } from "./utils";
import { isPromise, isString } from "./utils/types";
export type EqualFun<Data> = (val: unknown) => val is Data;
export type RuleFun<Data> = (
    value: unknown,
    data: Data,
    path: string,
    lang: LangType
) => string | undefined | Promise<string | undefined>;
export interface ErrorMessage {
    value: unknown;
    message: string;
}
export type GetMessageFun<Data> = (...arr: Parameters<RuleFun<Data>>) => string;
export type StoredMessage<Data> = string | GetMessageFun<Data>;
export type MessagesStore<Data> = Partial<
    Record<LangType, StoredMessage<Data>>
>;

export type InitSubmitFun<Data> = (
    input: unknown,
    data: Data,
    path: string,
    lang: LangType
) => Promise<Record<string, ErrorMessage>> | Record<string, ErrorMessage>;

function isNoPromises(
    val: Array<
        Promise<Record<string, ErrorMessage>> | Record<string, ErrorMessage>
    >
): val is Array<Record<string, ErrorMessage>> {
    return !val.some((val) => isPromise(val));
}

export default class Rule<Data> {
    private readonly eq: Data extends string ? Data : EqualFun<Data>;
    private readonly fn: RuleFun<Data>;
    private readonly initFn?: InitSubmitFun<Data>;
    constructor(
        eq: Data extends string ? Data : EqualFun<Data>,
        fn: RuleFun<Data>,
        initFn?: InitSubmitFun<Data>
    ) {
        this.eq = eq;
        this.fn = fn;
        this.initFn = initFn;
    }
    isequal(value: unknown): value is Data {
        if (isString(this.eq)) return value == this.eq;
        return this.eq(value);
    }
    validate(...arr: Parameters<RuleFun<Data>>) {
        return this.fn(...arr);
    }
    initSubmit(
        rules: Record<string, unknown[]>,
        input: unknown,
        lang: LangType
    ) {
        if (!this.initFn) return {};
        const messages: Array<
            Promise<Record<string, ErrorMessage>> | Record<string, ErrorMessage>
        > = [];
        objectKeys(rules).forEach((path) => {
            const arr = rules[path];
            if (arr == null) return;
            if (!this.initFn) return {};

            for (let i = 0; i < arr.length; i++) {
                const val = arr[i];
                if (this.isequal(val)) {
                    const message = this.initFn(input, val, path, lang);
                    if (message != undefined) messages.push(message);
                }
            }
        });
        if (isNoPromises(messages))
            return messages.reduce<Record<string, ErrorMessage[]>>(
                (acc, cur) => {
                    objectKeys(cur).forEach((key) => {
                        if (acc[key]) return acc[key].push(cur[key]);
                        else acc[key] = [cur[key]];
                    });
                    return acc;
                },
                {}
            );
        return new Promise<Record<string, ErrorMessage[]>>((res) => {
            Promise.all(messages.map(async (val) => await val)).then(
                (messages) =>
                    res(
                        messages.reduce<Record<string, ErrorMessage[]>>(
                            (acc, cur) => {
                                objectKeys(cur).forEach((key) => {
                                    if (acc[key])
                                        return acc[key].push(cur[key]);
                                    else acc[key] = [cur[key]];
                                });
                                return acc;
                            },
                            {}
                        )
                    )
            );
        });
    }
}
