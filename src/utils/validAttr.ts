import { Rules } from "../main";
import { _Error } from "../Rule";
import constructObj from "./constructObj";
import { isArray } from "./types";
function matchObjs(input: any, matchObj: any): any {
    if (matchObj === null) return input;
    if (input === undefined) return input;

    if (matchObj instanceof Array) {
        const [, _type,] = matchObj;
        const newObj: any = _type == "array" ? [] : {};
        
        if (_type == "array" && !isArray(input)) return [];
        if (isArray(input))
            for (let i = 0; i < input.length; i++) 
                newObj[i] = matchObjs(input[i], matchObj[0]);
            
        else{
            for (const key in input) 
                newObj[key] = matchObjs(input[key], matchObj[0]);
        }
            
        return newObj;
    } else {
        const newObj: any = {};
        for (const key in matchObj) {
            if (input[key]!==undefined) newObj[key] = matchObjs(input[key], matchObj[key]);
        }
        return newObj;
    }
}

export default function (input: any, rules: Rules): any {
    const RulesObj = constructObj(rules);
    return matchObjs(input, RulesObj);
}
