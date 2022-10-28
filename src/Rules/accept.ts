import Rule, { MessagesStore } from "../Rule"
import handelMessage from "../utils/handelMessage"
import handelUndefined from "../utils/handelUndefined"
export const Messages :MessagesStore={"en":"THE VALUE is not accepted type"}
export default new Rule("accepted", (value,...arr) => {
    return (
        value === 'on' ||
        value === 'true' ||
        value === 'yes' ||
        value === 1 ||
        value === '1' ||
        value === true
    )?undefined:handelMessage(Messages[arr[3]],value,...arr)
} )
