import { GetMessageFun, MessagesStore } from "../Rule";
export declare const MinErrors: MessagesStore;
export declare const MaXErrors: MessagesStore;
export default function _arrayRange(min: number, max: number, ...[obj, , validator, ...arr]: Exclude<Parameters<GetMessageFun>, string>): string | undefined;
