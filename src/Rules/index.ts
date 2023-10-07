import accept from "./accept";
import array from "./array";
import boolean from "./boolean";
import { isDate, date, after, before } from "./date";
import email from "./email";
import password from "./password";
import string from "./string";
import url from "./url";
import int from "./int";
import { min, max } from "./minMax";
import alpha_dash from "./alpha-dash";
import alpha_numeric from "./alpha-num";
import alpha from "./alpha";
import numeric from "./numeric";
import confirm from "./confirm";
import different from "./different";
import { _in, notIn } from "./in_notIn";
import required from "./required";
import { require_if, require_unless } from "./require_if";
import { require_without, require_withoutAll } from "./require_without";
import regExp from "./regExp";

export const AllRules = {
    accept,
    array,
    boolean,
    isDate,
    date,
    after,
    before,
    email,
    password,
    string,
    url,
    int,
    min,
    max,
    alpha_dash,
    alpha_numeric,
    alpha,
    numeric,
    confirm,
    different,
    _in,
    notIn,
    required,
    require_if,
    require_without,
    require_withoutAll,
    require_unless,
    regExp,
};

export type _Rules = typeof AllRules;
