import Rule, { RuleFun } from "../Rule";
import handelMessage from "../utils/handelMessage";
import ValueNOTtheSame from "./Messages/ValuesNotSame";
function regExp(...arr:Parameters<RuleFun>):ReturnType<RuleFun>{
    const [value,name,,,lang]=arr
    const val=name.split(":").slice(1).join(":")
    const regEx=val.split("/").slice(1,-1).join("/")
    const iden=val.split("/").at(-1)
    const res=new RegExp(regEx,iden).test(value)
    if(!res)
        return handelMessage(ValueNOTtheSame[lang],...arr)
    
}
export default new Rule(/(^regex:)\/\S+\/(\w*)$/,regExp)