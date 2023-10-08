/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/ban-types */
import type { ErrorMessage } from "@/Rule";
import type { ValidatorOptions } from "@/main";
import type { Rules, ValidTypes } from "@/type";
import type LangTypes from "@/types/lang";
declare global {
    interface Validator<T, Data> {
        reqData: Data;
        inputs: unknown;
        CPaths: Rules<T>;
        options: ValidatorOptions;
        errors: Record<string, ErrorMessage[]>;
        inValidErrors: Record<string, ErrorMessage> | null;
        lang: LangTypes;

        passes(): this is { inputs: ValidTypes<T> };
        asyncPasses(): boolean;
        fails(): boolean;
        asyncFails(): Promise<boolean>;
        getErrors(): Record<string, ErrorMessage[]> | null;
        asyncGetErrors(): Promise<Record<string, ErrorMessage[]> | null>;
        inside(): boolean;
        validAttr(): ValidTypes<T>;
        getValue(path: string): unknown;
        getAllValues<P extends keyof Rules<T>>(
            path: P
        ): Record<string, ValidTypes<Rules<T>[P]>>;
        setValue(path: string, value: unknown): boolean;
        setAllValues(path: string, value: unknown): boolean[];
    }
    namespace Validator {
        interface AvailableRules {
            array: {
                path: "array";
                type: Array<unknown>;
            };
            boolean: {
                path: "boolean";
                type: boolean;
            };
            date: {
                path: { date: Date; diff?: number };
                type: Date | string | number;
            };
            isDate: {
                path: "isDate";
                type: Date | string | number;
            };
            after: {
                path: { after: Date };
                type: Date | string | number;
            };
            before: {
                path: { before: Date };
                type: Date | string | number;
            };
            accept: {
                path: "accept";
                type: true | "on" | 1 | "1" | "yes" | "true";
            };
            string: {
                path: "string";
                type: string;
            };
            integer: {
                path: "integer";
                type: number;
            };
            email: {
                path: "email";
                type: string;
            };
            password: {
                path: "password";
                type: string;
            };
            url: {
                path: "url";
                type: string;
            };
            min: {
                path: { min: number };
                type: never;
            };
            max: {
                path: { max: number };
                type: never;
            };
            alpha_dash: {
                path: "alpha_dash";
                type: string;
            };
            alpha_numeric: {
                path: "alpha_dash";
                type: string;
            };
            alpha: {
                path: "alpha";
                type: string;
            };
            numeric: {
                path: "numeric";
                type: string;
            };
            confirm: {
                path: "confirm";
                type: string;
            };
            _in: {
                path: { in: Array<unknown> };
                type: never;
            };
            not_in: {
                path: { not_in: Array<unknown> };
                type: never;
            };
            required: {
                path: "required";
                type: NonNullable<never>;
            };
            require_if: {
                path: { require_if: { path: string; value: string } };
                type: never;
            };
            require_without: {
                path: { require_without: Array<string> };
                type: never;
            };
            require_withoutAll: {
                path: { require_withoutAll: Array<string> };
                type: never;
            };
            require_unless: {
                path: { require_unless: { path: string; value: string } };
                type: never;
            };
            regExp: {
                path: { regExp: RegExp };
                type: string;
            };
            different: {
                path: { different: string };
                type: never;
            };
        }
    }
}
