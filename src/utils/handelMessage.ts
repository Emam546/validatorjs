import handelUndefined from "./handelUndefined";
import { StoredMessage, GetMessageFun } from "../Rule";

export default function <T>(
    mess: StoredMessage<T> | undefined,
    ...arr: Parameters<GetMessageFun<T>>
): string {
    mess = handelUndefined(mess);
    if (typeof mess == "function") return mess(...arr);
    else return mess;
}
