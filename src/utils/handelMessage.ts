import handelUndefined from "./handelUndefined";
import { StoredMessage, GetMessageFun } from "@/Rule";

export default function (
    mess: StoredMessage | undefined,
    ...arr: Parameters<GetMessageFun>
): string {
    const g = handelUndefined(mess);
    if (typeof g == "function") return g(...arr);
    else return g;
}
