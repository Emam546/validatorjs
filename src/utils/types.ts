
export function isObject(attr: any): boolean {
    return typeof attr === "object" && !Array.isArray(attr) && attr !== null;
}
export function isString(value: any): boolean {
    return typeof value === "string" || value instanceof String;
}
export function isArray(value: any): boolean {
    return (
        value instanceof Array ||
        Object.prototype.toString.call(value) === "[object Array]"
    );
}
export function isNumber(value: any): boolean {
    return (
        !isNaN(value) && (value instanceof Number || typeof value == "number")
    );
}
export function onlyDigits(str: string | boolean | number) {
    const num = Number(str);
    return !isNaN(num) && typeof str !== "boolean";
}
export function isNumeric(value:any):boolean{
    return (onlyDigits(value) && !isArray(value))
}
