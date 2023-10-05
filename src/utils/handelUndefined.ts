import { StoredMessage } from "@/Rule";

export default function <Data>(val: StoredMessage<Data> | undefined): StoredMessage<Data> {
    if (val != undefined) return val;
    throw new Error("The defined message type is not recognizable");
}
