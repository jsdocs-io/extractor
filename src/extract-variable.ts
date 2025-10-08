import type { VariableDeclaration } from "ts-morph";
import { apparentType } from "./apparent-type";
import { docs } from "./docs";
import { formatSignature } from "./format-signature";
import { id } from "./id";
import { sourceFilePath } from "./source-file-path";
import type { ExtractedVariable } from "./types";

export const extractVariable = async (
	containerName: string,
	exportName: string,
	declaration: VariableDeclaration,
): Promise<ExtractedVariable> => ({
	kind: "variable",
	id: id(containerName, "+variable", exportName),
	name: exportName,
	docs: docs(declaration),
	file: sourceFilePath(declaration),
	line: declaration.getStartLineNumber(),
	signature: await variableSignature(exportName, declaration),
});

const variableSignature = async (
	name: string,
	declaration: VariableDeclaration,
): Promise<string> => {
	const kind = declaration.getVariableStatementOrThrow().getDeclarationKind().toString();
	const type = apparentType(declaration);
	return await formatSignature("variable", `${kind} ${name}: ${type}`);
};
