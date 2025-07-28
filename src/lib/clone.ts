export function cloneDeep<T>(obj: T): T {
  if (typeof obj === 'object') return cloneObject(obj);
  return obj;
}

function cloneObject<T>(obj: T): T {
  if (obj == null) return null as T;
  if (Array.isArray(obj)) return obj.map((v) => cloneDeep(v)) as T;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Map) return cloneMap(obj) as T;
  if (obj instanceof Set) return cloneSet(obj) as T;

  const result = Object.create(Object.getPrototypeOf(obj));
  const keys = Object.keys(obj);
  keys.forEach((k) => {
    result[k] = cloneDeep(obj[k as keyof T]);
  });
  return result as T;
}

function cloneMap<K, V>(obj: Map<K, V>): Map<K, V> {
  const result = new Map<K, V>();
  for (const [key, value] of obj) {
    result.set(key, cloneDeep(value));
  }
  return result;
}

function cloneSet<V>(obj: Set<V>): Set<V> {
  const result = new Set<V>();
  for (const value of obj) {
    result.add(cloneDeep(value));
  }
  return result;
}
