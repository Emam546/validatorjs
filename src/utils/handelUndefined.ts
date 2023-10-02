import { StoredMessage } from "@/Rule";

export default function <T>(
    val: StoredMessage<T> | undefined
): StoredMessage<T> {
    if (val != undefined) return val ;
    throw new Error("The defined message type is not recognizable");
}
