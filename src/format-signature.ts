import { format } from "prettier";
import type { AllExtractedDeclarationKind } from "./types";

export const formatSignature = async (
	kind: AllExtractedDeclarationKind,
	signature: string,
): Promise<string> => {
	const s = signature
		.trim()
		// Remove unnecessary keywords at declaration start.
		.replace(/^export\s+/, "")
		.replace(/^default\s+/, "")
		.replace(/^declare\s+/, "");
	switch (kind) {
		case "variable": {
			// Temporarily replace the invalid variable name `default` before the type.
			const raw = s.replace("default:", "_______:");
			const formatted = await formatWithPrettier(raw);
			return formatted.replace("_______:", "default:");
		}
		case "function": {
			// Temporarily add `let` to format the function like a variable signature.
			const raw = `let ${s.replace("default:", "_______:")}`;
			const formatted = await formatWithPrettier(raw);
			return formatted.replace("_______:", "default:").replace(/^let\s/, "");
		}
		case "class":
		case "interface":
		case "enum":
		case "type":
		case "namespace": {
			// Just format the signature as-is.
			const formatted = await formatWithPrettier(s);
			return formatted;
		}
		case "class-constructor":
		case "class-property":
		case "class-method":
		case "interface-property":
		case "interface-method":
		case "interface-construct-signature":
		case "interface-call-signature":
		case "interface-index-signature":
		case "interface-get-accessor":
		case "interface-set-accessor":
		case "enum-member": {
			// Temporarily wrap members in their parent declaration for formatting.
			const parentKind = kind.split("-")[0]!;
			const raw = `${parentKind} P { ${s} }`;
			const formattedParent = await formatWithPrettier(raw);
			const formatted = formattedParent
				// Remove parent wrapper on first and last lines.
				.split("\n")
				.slice(1, -1)
				// Remove indentation.
				.map((line) => line.replace(/^\s{2}/, ""))
				.join("\n")
				// Remove trailing comma in enum member signature.
				.replace(/,$/, "");
			return formatted;
		}
	}
};

const formatWithPrettier = async (s: string): Promise<string> => {
	try {
		const formatted = (await format(s, { parser: "typescript" })).trim();
		return formatted;
	} catch {
		return s;
	}
};
