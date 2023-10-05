/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/ban-types */
import type Rule from "@/Rule";
import type { _Rules } from "@/Rules";
import { _Error } from "@/Rule";
import { Rules, ValidTypes } from "@/type";
import { ValidatorOptions } from "@/main";
import LangTypes from "@/types/lang";
declare global {
    interface Validator<T, Data> {
        reqData: Data;
        inputs: unknown;
        CRules: Rules<T>;
        options: ValidatorOptions;
        errors: Record<string, _Error[]>;
        inValidErrors: Record<string, _Error> | null;
        lang: LangTypes;

        passes(): this is { inputs: ValidTypes<T> };
        asyncpasses(): Promise<this & { inputs: ValidTypes<T> }>;
        fails(): boolean;
        getErrors(): Record<string, _Error[]> | null;
        inside(): boolean;
        validAttr(): ValidTypes<T>;
        getValue(path: string): unknown;
        getAllValues(path: string): Record<string, unknown>;
        setValue(path: string, value: unknown): boolean;
        setAllValues(path: string, value: unknown): boolean[];
    }
    namespace Validator {
        interface AvailableRules extends _Rules {}
        type ArrayRules = AvailableRules[keyof AvailableRules][];
        type RulesNames = {
            [K in keyof AvailableRules]: AvailableRules[K] extends Rule<
                infer Name
            >
                ? Name
                : unknown;
        }[keyof AvailableRules];
        type RulesGetter = Validator.RulesNames[] | null;
    }
}