import Rule, { MessagesStore } from "../Rule";
import handelMessage from "../utils/handelMessage";
import { isNumeric } from "../utils/types";
export const Messages:MessagesStore={"en":"The input value is not numeric"};

export default new Rule("numeric",(value,...arr) => {
    return isNumeric(value)?undefined:handelMessage(Messages[arr[3]],value,...arr);
},);
