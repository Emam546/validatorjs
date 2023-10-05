import { GetMessageFun, StoredMessage } from "@/Rule";

export default function <Data>(
    mess: StoredMessage<Data> | undefined,
    ...arr: Parameters<GetMessageFun<Data>>
): string | undefined {
    if (mess != undefined)
        if (typeof mess == "function") return mess(...arr);
        else return mess;
    return undefined;
}
