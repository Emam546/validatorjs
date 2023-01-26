import { GetMessageFun, StoredMessage } from "../Rule";
export default function (mess: StoredMessage | undefined, ...arr: Parameters<GetMessageFun>): string | undefined;
