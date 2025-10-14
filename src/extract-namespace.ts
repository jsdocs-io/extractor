import { ModuleDeclaration } from "ts-morph";
import { docs } from "./docs.ts";
import { formatSignature } from "./format-signature.ts";
import { id } from "./id.ts";
import { sourceFilePath } from "./source-file-path.ts";
import type { ExtractedDeclaration, ExtractedNamespace } from "./types.ts";

export async function extractNamespace(
	containerName: string,
	exportName: string,
	declaration: ModuleDeclaration,
	declarations: ExtractedDeclaration[],
): Promise<ExtractedNamespace> {
	return {
		kind: "namespace",
		id: id(containerName, "+namespace", exportName),
		name: exportName,
		docs: docs(declaration),
		file: sourceFilePath(declaration),
		line: declaration.getStartLineNumber(),
		signature: await namespaceSignature(exportName),
		declarations,
	};
}

async function namespaceSignature(exportName: string): Promise<string> {
	const containerKeyword =
		exportName.startsWith('"') || exportName.startsWith("'") ? "module" : "namespace";
	const signature = `${containerKeyword} ${exportName} {}`;
	return await formatSignature("namespace", signature);
}
