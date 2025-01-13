const key = "filter"

export const savedFilterToLS = (value: string) => {
    localStorage.setItem(key, value)
}


export const getFilterFromLS = () => {
    return localStorage.getItem(key)
}