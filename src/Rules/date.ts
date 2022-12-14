import Rule, { MessagesStore, RuleFun } from "../Rule";
import handelMessage from "../utils/handelMessage";
import isEmpty from "../utils/isEmpty";
import { isString } from "../utils/types";
export const NotValidDate: MessagesStore = { en: "THE DATE IS NOT VALID" };
export const After: MessagesStore = {
    en: (_, name) => `The Date is before ${getTimeName(name)} date`,
};
export const Before: MessagesStore = {
    en: (_, name) => `The Date is after ${getTimeName(name)} date`,
};
export const Equal: MessagesStore = {
    en: (_, name) => `The Date is not equal ${getTimeName(name)} date`,
};
function _getDateName(name:string):string{
    const regExp=/^\w+:(.+)/gi
    const res=regExp.exec(name)
    if(!res)return ""
    return res[1]
}
function isValidDate(dateString: any):boolean {
    return getTime(dateString).toString() !== "Invalid Date"
}
function getTime(dateString:any):Date{
    if(dateString instanceof Date)
        return dateString
    if(isEmpty(dateString))
        return new Date("Invalid Date")
    if (isString(dateString)&&/(^\d+)$/.test(dateString) && !isNaN(parseInt(dateString))) {
        return new Date(parseInt(dateString));
    }else
        return new Date(dateString);
}
function getTimeName(name: string):Date {
    const dateName = _getDateName(name);
    if (dateName.startsWith("now")) {
        if(isNaN(parseInt(dateName.slice(4))))
            return new Date(Date.now());
        let num=Date.now()
        const inNum=parseInt(dateName.slice(4))
        switch (dateName.at(3)) {
            case "+":
                num+=inNum
                break;
            case "-":
                num-=inNum
                
        }
        return new Date(num)
    }
    
    else{
        if(!isValidDate(dateName))
            throw new Error(`THE DATE ${dateName} IS NOT VALID`)
        return getTime(dateName);
    }
}
function isDateFn(...arr: Parameters<RuleFun>){
    const [value, name, , , lang] = arr;
    if (!isValidDate(value)) return handelMessage(NotValidDate[lang], ...arr);
}
function afterfn(...arr: Parameters<RuleFun>): ReturnType<RuleFun> {
    const [dateV, name, , , lang] = arr;
    if (!isValidDate(dateV)) return handelMessage(NotValidDate[lang], ...arr);
    if (getTimeName(name) > getTime(dateV))
        return handelMessage(After[lang], ...arr);
}
function beforefn(...arr: Parameters<RuleFun>): ReturnType<RuleFun> {
    const [value, name, , , lang] = arr;
    if (!isValidDate(value)) return handelMessage(NotValidDate[lang], ...arr);
    if (getTimeName(name) < getTime(value))
        return handelMessage(Before[lang], ...arr);
}
function equal(...arr: Parameters<RuleFun>): ReturnType<RuleFun> {
    const [value, name, , , lang] = arr;
    if (!isValidDate(value)) return handelMessage(NotValidDate[lang], ...arr);
    if (Math.abs(getTimeName(name).getTime()-getTime(value).getTime())>1000)
        return handelMessage(Before[lang], ...arr);
}
export const isDate = new Rule("isDate", isDateFn);
export const date = new Rule(/(^date:)/, equal);
export const after = new Rule(/(^after:)/, afterfn);
export const before = new Rule(/(^before:)/, beforefn);


