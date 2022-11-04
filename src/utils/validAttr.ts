import { Rules } from "../main";
import { _Error } from "../Rule";
import constructObj from "./constructObj";
import { isArray } from "./types";
function returnObj(input: any, path: string): Object {
    if (!path.length) return input;
    const paths = path.split(".");
    let newObj: any = {};
    if (paths[0].startsWith("*:array")) {
        newObj = [];
        for (const key in input)
            newObj.push(returnObj(input[key], paths.slice(1).join(".")));

        return newObj;
    } else if (paths[0].startsWith("*:object")) {
        newObj = {
            [paths[0]]: {},
        };
        for (const key in input[paths[0]])
            newObj[paths[0]][key] = returnObj(
                input[paths[0]][key],
                paths.slice(1).join(".")
            );
        return newObj;
    } else
        newObj = {
            [paths[0]]: returnObj(input[paths[0]], paths.slice(1).join(".")),
        };

    return newObj;
}
function matchObjs(input: any, matchObj: any): Object {
    if (matchObj == null) return input;
    if (input == undefined) return input;

    if (matchObj instanceof Array) {
        const [, _type,] = matchObj;
        const newObj: any = _type == "array" ? [] : {};
        
        if (_type == "array" && !isArray(input)) return [];
        if (isArray(input))
            for (let i = 0; i < input.length; i++) 
                newObj[i] = matchObjs(input[i], matchObj[0]);
            
        else{
            let i=0
            for (const key in input) 
                    newObj[key] = matchObjs(input[key], matchObj[0]);
        }
            
        return newObj;
    } else {
        const newObj: any = {};
        for (const key in matchObj) {
            if (input[key]) newObj[key] = matchObjs(input[key], matchObj[key]);
        }
        return newObj;
    }
}

export default function (input: any, rules: Rules): Object {
    const RulesObj = constructObj(rules);
    return matchObjs(input, RulesObj);
}
