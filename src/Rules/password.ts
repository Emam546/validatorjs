import Rule, { MessagesStore } from "@/Rule";
import handelMessage from "@/utils/handelMessage";
export const Messages: MessagesStore<string> = {
    en: "THE PASSWORD IS NOT VALID",
};

export default new Rule<unknown, string>("password", (value, ...arr) => {
    return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(value)
        ? undefined
        : handelMessage(Messages[arr[3]], value, ...arr);
});
