import Rule, { MessagesStore } from "../Rule"
import handelMessage from "../utils/handelMessage";
import { isString } from "../utils/types"
export const Messages:MessagesStore={"en":"THE TYPE OF INPUT IS NOT STRING"}

export default new Rule("string",
    (value,...arr) => {
        return isString(value)?undefined:handelMessage(Messages[arr[3]],value,...arr);
    }
)