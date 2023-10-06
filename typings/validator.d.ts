import { ErrorMessage } from "@/Rule";
import { ValidatorOptions } from "@/main";
import { Rules, ValidTypes } from "@/type";
import LangTypes from "@/types/lang";

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
        getAllValues(path: string): Record<string, unknown>;
        setValue(path: string, value: unknown): boolean;
        setAllValues(path: string, value: unknown): boolean[];
    }
}
