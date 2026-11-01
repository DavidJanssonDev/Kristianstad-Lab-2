const KEY = "newsletters";


export function getNewsLetters() {
    try {
        return JSON.parse(localStorage.getItem(KEY)) ?? []
    } catch {
        return []
    }
}

export function addNewsletter(entry) {
    const all = getNewsLetters();
    all.push({id: crypto.randomUUID(), ...entry})
    localStorage.setItem(KEY, JSON.stringify(all))
}