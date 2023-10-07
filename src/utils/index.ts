export function ObjectEntries<T extends object>(
    val: T
): {
    [K in keyof T]: [K, T[K]];
}[keyof T][] {
    return Object.entries(val) as any;
}
export function objectKeys<T extends object>(val: T): Array<keyof T> {
    return Object.keys(val) as Array<keyof T>;
}
export function objectValues<T extends object>(val: T): Array<T[keyof T]> {
    return Object.values(val);
}
