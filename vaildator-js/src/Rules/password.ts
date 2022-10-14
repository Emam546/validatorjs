import Rule, { MessagesStore }  from "../Rule"
import handelMessage from "../utils/handelMessage";
export const Messages:MessagesStore={"en":"THE PASSWORD IS NOT VALID"}

export default new Rule("password",
    (value,...arr) => {
        return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(value)?undefined:handelMessage(Messages[arr[3]],value,...arr);
    }, );