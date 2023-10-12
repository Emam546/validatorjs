import handelUndefined from "./handelUndefined";
import type { StoredMessage, GetMessageFun } from "@/Rule";

export default function <Data, G extends StoredMessage<Data> | undefined>(
    mess: G,
    ...arr: Parameters<GetMessageFun<Data>>
): string {
    const g = handelUndefined(mess);
    if (typeof g == "function") return g(...arr);
    else return g;
}
