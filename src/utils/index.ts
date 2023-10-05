export function objectKeys<T extends object>(val: T): Array<keyof T> {
    return Object.keys(val) as Array<keyof T>;
}
