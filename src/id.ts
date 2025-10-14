export function id(...parts: string[]) {
	return parts.filter(Boolean).join(".");
}
