import handelUndefined from "./handelUndefined";
import handelUnError from "./handelUnError";
import { StoredMessage,GetMessageFun } from "../Rule";

export default function(mess:StoredMessage|undefined,...arr:Parameters<GetMessageFun>):string{
    mess=handelUndefined(mess)
    if (typeof mess == "function") return mess(...arr);
    else return mess;
}
