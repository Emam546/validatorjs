import Validator from "../main";
import { GetMessageFun, MessagesStore } from "../Rule";
export const MinErrors: MessagesStore = {
    en: "YOU DIDN'T REACH THE MINIMUM LIMIT OF ARRAY",
};
export const MaXErrors: MessagesStore = {
    en: "YOU REACHED THE MAXIMUM LIMIT OF ARRAY",
};
export default function _arrayRange(
    min: number,
    max: number,
    ...[obj,,validator,...arr]:Exclude<Parameters<GetMessageFun>,string>
): string | undefined {
    let length = obj instanceof Array? obj.length : Object.keys(obj).length;
    let minError, maxError;
    if (
        !(minError = MinErrors[validator.lang]) ||
        !(maxError = MaXErrors[validator.lang])
    )
        throw new Error(
            "You must provide a min max message for this language"
        );
    if (min > length)
        if (typeof minError == "string") return minError;
        else return minError(obj, "minError", validator,...arr);
    else if (max<length)
        if (typeof maxError == "string") return maxError;
        else return maxError(obj, "maxError", validator,...arr);
}
