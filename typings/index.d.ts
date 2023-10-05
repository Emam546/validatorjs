/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/ban-types */
import Rule, { _Error } from "@/Rule";
import { AllRules } from "@/Rules";
import { ValidatorOptions } from "@/main";
import { Rules } from "@/parseRules";
import LangTypes from "@/types/lang";
type _Rules = typeof AllRules;

declare global {
    interface Validator<T, Data> {
        reqData: Data;
        inputs: unknown;
        CRules: Rules<T>;
        options: ValidatorOptions;
        errors: Record<string, _Error[]>;
        inValidErrors: Record<string, _Error> | null;
        lang: LangTypes;

        passes(): this is { inputs: any };
        fails(): Promise<boolean>;
        getErrors(): Promise<Record<string, _Error[]> | null>;
        inside(): boolean;
        validAttr(): any;
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
    }
}
