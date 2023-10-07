export function objectKeys<T extends object>(val: T): Array<keyof T> {
    return Object.keys(val) as Array<keyof T>;
}
export function objectValues<T extends object>(val: T): Array<T[keyof T]> {
    return Object.values(val);
}
