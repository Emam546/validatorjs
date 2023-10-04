import { GetMessageFun, StoredMessage } from "@/Rule";

export default function (
    mess: StoredMessage | undefined,
    ...arr: Parameters<GetMessageFun>
): string | undefined {
    if (mess != undefined)
        if (typeof mess == "function") return mess(...arr);
        else return mess;
    return undefined;
}
