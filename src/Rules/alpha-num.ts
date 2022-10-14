import Rule, { MessagesStore } from "../Rule"
import handelMessage from "../utils/handelMessage"
const Messages:MessagesStore={"en":"The input value must contains only characters or numeric values"}
export default new Rule("alpha_num",(value: string,...arr) => {
  return /^[a-zA-Z0-9]+$/.test(value)?undefined:handelMessage(Messages[arr[3]],value,...arr)
},)
