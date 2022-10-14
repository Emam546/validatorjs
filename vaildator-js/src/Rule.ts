import LangType from "./types/lang";
import Validator, { Rules } from "./main";
import { isString } from "./utils/types";

export type RuleFun = (
    value: any,
    name: string,
    validator: Validator,
    path:string,
    lang:LangType
) => string|undefined|Promise<string|undefined>;
export interface _Error {
    value: any;
    message: string;
}
export type GetMessageFun=(value: any,name: string,validator: Validator,path:string,...a:any[])=>string
export type StoredMessage=string|GetMessageFun
export type MessagesStore=Partial<Record<LangType,StoredMessage>>
export type InitSubmitFun = (name:string,validator:Validator,path:string,lang:LangType)=>ReturnType<RuleFun>
export default class Rule {
    private readonly name: RegExp | String;
    private readonly fn: RuleFun;
    private readonly initFn
    constructor(name: RegExp | String, fn: RuleFun,initFn?:InitSubmitFun) {
        this.name = name;
        this.fn = fn;
        this.initFn=initFn
    }
    isequal(value: string): boolean {
        if (isString(this.name) && this.name == value) return true;
        else if (this.name instanceof RegExp) return value.match(this.name)!=null
        return false;
    }
    async validate(value: any, name: string, validator: Validator,path:string,lang:LangType): Promise<string | undefined> {
        return await this.fn(value, name, validator,path,lang);
    }

    async initSubmit(validator:Validator,lang:LangType):Promise<Record<string, _Error[]>>{
        const {CRules:rules}=validator
        const returnedErrors:Record<string,_Error[]>={ }
        if(!this.initFn)return {}
        for (const path in rules) {
            const arr=rules[path];
            if(arr)
            for (let i = 0; i < arr.length; i++) {
                if(this.isequal(arr[i])){
                    const message=await this.initFn(arr[i],validator,path,lang)
                    if(message!=undefined)
                        if(returnedErrors[path])
                            returnedErrors[path].push({message,value:validator.inputs})
                        else returnedErrors[path]=[{message,value:validator.inputs}]
                }
            } 
            
        }
        return returnedErrors
    }

    inside(){
        
    }
}
