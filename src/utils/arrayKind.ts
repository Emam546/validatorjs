export const TYPE_ARRAY = ["object", "array"];
export default function arrayKind(array: Array<unknown>): string {
    //get string rule of the  array rule
    //for example [{name:"ali"},"array",1,3]->*:array:1:3
    const [, type_] = array;
    let prop = "";
    if (typeof type_ == "string" && TYPE_ARRAY.includes(type_)) {
        prop += ":" + type_;
    } else prop += ":array";
    return prop;
}
