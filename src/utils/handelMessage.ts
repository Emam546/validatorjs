import handelUndefined from "./handelUndefined";
import { StoredMessage, GetMessageFun } from "@/Rule";

export default function <T>(
    mess: StoredMessage<T> | undefined,
    ...arr: Parameters<GetMessageFun<T>>
): string {
    const g = handelUndefined(mess);
    if (typeof g == "function") return g(...arr);
    else return g;
}
