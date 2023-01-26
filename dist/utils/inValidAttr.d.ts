import { Rules } from "..";
import { _Error } from "../Rule";
export declare type ReturnTypeUnMatch = Record<string, _Error> | null;
export declare function unMatchedValues(input: any, unMatchObj: any, addedPath?: string): ReturnTypeUnMatch;
export default function (input: any, rules: Rules): ReturnTypeUnMatch;
