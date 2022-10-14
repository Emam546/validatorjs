import Rule, { MessagesStore } from "../Rule"
import handelMessage from "../utils/handelMessage"
export const Messages:MessagesStore={"en":"The input value contains alpha-numeric characters, as well as dashes and underscores."}
export default new Rule("alpha_dash",(value: string,...arr) => {
  return /^[a-zA-Z0-9_\-]+$/.test(value)?undefined:handelMessage(Messages[arr[3]],value,...arr)
},)
