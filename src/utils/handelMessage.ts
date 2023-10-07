import handelUndefined from "./handelUndefined";
import type { StoredMessage, GetMessageFun } from "@/Rule";

export default function <Data>(
    mess: StoredMessage<Data> | undefined,
    ...arr: Parameters<GetMessageFun<Data>>
): string {
    const g = handelUndefined(mess);
    if (typeof g == "function") return g(...arr);
    else return g;
}
