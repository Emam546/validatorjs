"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
const TYPE_ARRAY = ["object", "array"];
const DEFAULT_TYPE = TYPE_ARRAY[1];
function isObject(attr) {
    return typeof attr === 'object' &&
        !Array.isArray(attr) &&
        attr !== null;
}
function isString(myVar){
    return (typeof myVar === 'string' || myVar instanceof String)
}
class Validator {
    constructor(inputs, rules, options) {
        this.inputs = inputs;
        this.rules = this._parseRules(rules);
        this.options = options;
        this.errors = {};
    }
    passes() {
        let result = {};
        let Errors = {};
        for (const path in this.rules) {
            const r = this._get_values(this.inputs, path);
            result = {...result, ...r[0]};
            Errors = {...Errors, ...r[1]};
        }
        
        //TODO: provide a check object method
        console.log(result);
        console.log(Errors);
    }
    _get_values(inputs, path, addedPath = "") {
        const paths = path.split(".");
        let currentObj = inputs;
        let result = {};
        let minMaxERRORS = {};
        for (let i = 0; i < paths.length; i++) {
            if (paths[i].indexOf("*") == 0) {
                let [_, type_, min, max] = paths[i].split(":");
                const oldPath = paths.slice(0, i).join(".");
                type_ = type_ || DEFAULT_TYPE;
                min = parseInt(min) || 0;
                max = parseInt(max) || Infinity;
                const newPath = paths.slice(i + 1).join(".");
                if (type_ === "array" && currentObj instanceof Array) {
                    if (!(min <= currentObj.length))
                        minMaxERRORS[addedPath + paths.slice(0, i).join(".")] = "YOU DIDN'T REACH THE MINIMUM LIMIT OF ARRAY";
                    else if (!(currentObj.length < max))
                        minMaxERRORS[addedPath + paths.slice(0, i).join(".")] = "YOU REACHED THE MAXIMUM LIMIT OF ARRAY";
                    for (let i = 0; i < currentObj.length; i++) {
                        const r = this._get_values(currentObj[i], newPath, `${addedPath}${oldPath}.*${i}.`);
                        result = {...result, ...r[0]};
                        minMaxERRORS = {...minMaxERRORS, ...r[1]};
                    }
                }
                else if (type_ === "array" && currentObj instanceof Object) {
                    const length = Object.keys(currentObj).length;
                    if (!(min <= length))
                        minMaxERRORS[addedPath + paths.slice(0, i).join(".")] = "YOU DIDN'T REACH THE MINIMUM LIMIT OF OBJECT";
                    else if (!(length < max))
                        minMaxERRORS[addedPath + paths.slice(0, i).join(".")] = "YOU REACHED THE MAXIMUM LIMIT OF OBJECT";
                    for (const key in currentObj) {
                        const r = this._get_values(currentObj[key], newPath, `${addedPath}${oldPath}.${key}.`);
                        result = {...result, ...r[0]};
                        minMaxERRORS = {...minMaxERRORS, ...r[1]};
                    }
                }
                break;
            }
            else if (isObject(currentObj)) {
                if (!Object.prototype.hasOwnProperty.call(currentObj, paths[i]))
                    break;
                currentObj = currentObj[paths[i]];
                if (i === paths.length - 1)
                    result[addedPath + path] = currentObj;
            }
        }
        return [result, minMaxERRORS];
    }
    _parseRules(input) {
        //just parse rules from the object
        //it must alway finishes with 
        // - array of string  that describes rules
        // - string that split with | sign

        const flattened = {};
        const _get_rule = (rules, property) => {
            if (Array.isArray(rules)) {

                // if there is added property before add . 
                const p = property ? property + ".*" : "*";
                if (rules.length) {
                    //get the type of the array
                    // - array of rules
                    // - array that describes a rules of the object or array
                    
                    if (this._is_Rule(rules))
                        //check if it is array that describes some rule
                        flattened[property || "*"] = rules;
                    else if (rules.length && rules.length <= 4)
                        //get array rules and continue in parsing object
                        _get_rule(rules[0], p + this._arrayKind(rules));
                    else
                        throw new Error(`${rules} is not a valid rule input`);
                }
                else
                    flattened[p] = null;
            }
            else {
                for (const prop in rules) {
                    if (!Object.prototype.hasOwnProperty.call(rules, prop))
                        continue;
                    const rule = rules[prop];
                    const p = property ? property + "." + prop : prop;
                    switch (typeof rule) {
                        case "string":
                            
                            flattened[p] = rule.split("|");
                            break;
                        case "object":
                            if (rule === null)
                                //if it is null just finish the recursion
                                flattened[p] = rule;
                            else 
                                _get_rule(rule, p);
                            
                    }
                }
            }
        };
        _get_rule(input);
        return flattened;
    }
    _arrayKind(array) {
        //get string rule of the  array rule
        //for example [{name:"ali"},"array",1,3]->*:array:1:3
        let [_, type_, min, max] = array;
        let prop = "";
        if (TYPE_ARRAY.includes(type_)) {
            prop += ":" + type_;
            min = parseInt(min);
            if (min) {
                prop += ":" + min;
                max = parseInt(max);
                if (max)
                    prop += ":" + max;
            }
        }
        return prop;
    }
    _is_Rule(array) {
        return !array.some((v) => {
            return !(isString(v) || v instanceof RegExp);
        });
    }
}
exports.Validator = Validator;
