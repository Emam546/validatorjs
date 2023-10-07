import { GetMessageFun, StoredMessage } from "@/Rule";

export default function <Data, G extends StoredMessage<Data> | undefined>(
    mess: G,
    ...arr: Parameters<GetMessageFun<Data>>
): string | undefined {
    if (mess != undefined)
        if (typeof mess == "function") return mess(...arr);
        else return mess;
    return undefined;
}
