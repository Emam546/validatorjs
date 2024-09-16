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
  if (typeof obj == "undefined" || obj == null) return false;
  return Object.prototype.hasOwnProperty.call(obj, key);
}
