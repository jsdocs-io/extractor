export function id(...parts: string[]): string {
	return parts.filter(Boolean).join(".");
}
