import LangType from "./types/lang";
import { Validator  } from "./main";
import { isString } from "./utils/types";

export type RuleFun<Data=any> = (
    value: any,
    name: string,
    validator: Validator<any,Data>,
    path:string,
    lang:LangType
) => string|undefined|Promise<string|undefined>;
export interface _Error {
    value: any;
    message: string;
}
export type GetMessageFun=(value: any,name: string,validator: Validator,path:string,...a:any[])=>string
export type StoredMessage=string|GetMessageFun
export type MessagesStore=Record<LangType,StoredMessage>
export type InitSubmitFun<Data=any> = (name:string,validator:Validator<any,Data>,path:string,lang:LangType)=>Record<string,_Error[]>
export default class Rule<Data=any> {
    private readonly name: RegExp | String;
    private readonly fn: RuleFun<Data>;
    private readonly initFn
    constructor(name: RegExp | String, fn: RuleFun<Data>,initFn?:InitSubmitFun) {
        this.name = name;
        this.fn = fn;
        this.initFn=initFn
    }
    isequal(value: string): boolean {
        if (isString(this.name) && this.name == value) return true;
        else if (this.name instanceof RegExp) return value.match(this.name)!=null
        return false;
    }
    async validate(value: any, name: string, validator: Validator<any>,path:string,lang:LangType): Promise<string | undefined> {
        return await this.fn(value, name, validator,path,lang);
    }

    async initSubmit(validator:Validator,lang:LangType):Promise<Record<string, _Error[]>>{
        const {CRules:rules}=validator
        let returnedErrors:Record<string,_Error[]>={ }
        if(!this.initFn)return {}
        for (const path in rules) {
            const arr=rules[path];
            if(arr)
            for (let i = 0; i < arr.length; i++) {
                if(this.isequal(arr[i])){
                    const message=await this.initFn(arr[i],validator,path,lang)
                    if(message!=undefined)
                        returnedErrors={...returnedErrors,...message}
                        
                }
            } 
            
        }
        return returnedErrors
    }


}
