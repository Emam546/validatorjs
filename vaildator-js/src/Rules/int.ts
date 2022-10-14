import Rule, { MessagesStore } from "../Rule";
import handelMessage from "../utils/handelMessage";
import { isNumber } from "../utils/types";
export const Messages:MessagesStore={en: "the input value is not a number",}

export default new Rule(
    "integer",
    (value,...arr) => {
        return isNumber(value)?undefined:handelMessage(Messages[arr[3]],value,...arr)
    },
    
);
