/* eslint-disable no-useless-escape */
import Rule, { MessagesStore } from "../Rule";
import handelMessage from "../utils/handelMessage";
export const Messages: MessagesStore<string> = { en: "THE URL IS NOT VALID" };

export default new Rule<unknown, string>("url", (value, ...arr) => {
    return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_\+.~#?&/=]*)/i.test(
        value
    )
        ? undefined
        : handelMessage(Messages[arr[3]], value, ...arr);
});
