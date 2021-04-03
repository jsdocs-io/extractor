export function toID(...elements: string[]): string {
    return elements.filter(Boolean).join('.');
}
