export default function (...arr: unknown[]): boolean {
    const defaultValue = JSON.stringify(arr[0]);
    for (let i = 1; i < arr.length; i++) {
        if (defaultValue !== JSON.stringify(arr[i])) return false;
    }
    return true;
}
export function hasOwnProperty<K extends PropertyKey, T>(
    obj: unknown,
    key: K
): obj is Record<K, T> {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
export function object_equals(x: unknown, y: unknown): boolean {
    if (x === y) return true;
    // if both x and y are null or undefined and exactly the same

    if (!(x instanceof Object) || !(y instanceof Object)) return false;
    // if they are not strictly equal, they both need to be Objects

    if (x.constructor !== y.constructor) return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.

    for (const p in x) {
        if (!hasOwnProperty(x, p)) continue;
        // other properties were tested using x.constructor === y.constructor

        if (!hasOwnProperty(y, p)) return false;
        // allows to compare x[ p ] and y[ p ] when set to undefined

        if (x[p] === y[p]) continue;
        // if they have the same strict value or identity then they are equal

        if (typeof x[p] !== "object") return false;
        // Numbers, Strings, Functions, Booleans must be strictly equal

        if (!object_equals(x[p], y[p])) return false;
        // Objects and Arrays must be tested recursively
    }

    for (const p in y)
        if (
            Object.prototype.hasOwnProperty.call(y, p) &&
            !Object.prototype.hasOwnProperty.call(x, p)
        )
            return false;
    // allows x[ p ] to be set to undefined

    return true;
}
