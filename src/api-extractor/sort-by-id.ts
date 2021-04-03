export function sortByID(a: { id: string }, b: { id: string }): number {
    return a.id.localeCompare(b.id);
}
