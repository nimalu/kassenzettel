function getOrDefault<T, K extends keyof T>(obj: T, key: K, def: T[K]) {
    if (typeof obj[key] != 'undefined') {
        return obj[key]
    }
    return def
}    
export default getOrDefault