export const TYPE_ARRAY = ["object", "array"];
export default function arrayKind(array: Array<any>): string {
    //get string rule of the  array rule
    //for example [{name:"ali"},"array",1,3]->*:array:1:3
    let [, type_, min, max] = array as Array<any>;
    let prop = "";
    if (TYPE_ARRAY.includes(type_)) {
        prop += ":" + type_;
        min = parseInt(min);
        if (!isNaN(min)) {
            prop += ":" + min.toString();
            max = parseInt(max);
            if (!isNaN(max)) prop += ":" + max.toString();
        }
    } else prop += ":array";

    return prop;
}