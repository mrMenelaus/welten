export function getTagHelper(...parts: string[]){
    return (...ids: string[]) => [...parts, ...ids].join("-")
}