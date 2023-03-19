import { GetMessageFun, StoredMessage } from "../Rule";

export default function<T>(mess:StoredMessage<T>|undefined,...arr:Parameters<GetMessageFun<T>>):string|undefined{
    if (mess != undefined)
        if (typeof mess == "function") return mess(...arr);
        else return mess;
    
}