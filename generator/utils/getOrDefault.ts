function getOrDefault<T, K extends keyof T>(obj: T, key: K, def: T[K]) {
    if (typeof obj == "undefined" || obj == null || typeof obj[key] == "undefined") {
        return def
    }
    return obj[key]
}
export default getOrDefault