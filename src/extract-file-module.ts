import { SourceFile, SyntaxKind } from "ts-morph";
import { formatSignature } from "./format-signature";
import { id } from "./id";
import { sourceFilePath } from "./source-file-path";
import type { ExtractedDeclaration, ExtractedNamespace } from "./types";

export const extractFileModule = async (
	containerName: string,
	exportName: string,
	declaration: SourceFile,
	declarations: ExtractedDeclaration[],
): Promise<ExtractedNamespace> => ({
	kind: "namespace",
	id: id(containerName, "+namespace", exportName),
	name: exportName,
	docs: fileModuleDocs(declaration),
	file: sourceFilePath(declaration),
	line: declaration.getStartLineNumber(),
	signature: await fileModuleSignature(declaration),
	declarations,
});

const fileModuleDocs = (declaration: SourceFile): string[] => {
	const firstDoc = declaration.getFirstDescendantByKind(SyntaxKind.JSDoc)?.getText();
	if (!firstDoc) {
		return [];
	}
	return [firstDoc];
};

const fileModuleSignature = async (declaration: SourceFile): Promise<string> => {
	const filename = declaration.getSourceFile().getBaseName();
	return await formatSignature("namespace", `module "${filename}" {}`);
};
