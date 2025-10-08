import type { VariableDeclaration } from "ts-morph";
import { docs } from "./docs";
import { formatSignature } from "./format-signature";
import { id } from "./id";
import { sourceFilePath } from "./source-file-path";
import { typeCheckerType } from "./type-checker-type";
import type { ExtractedFunction } from "./types";

export const extractFunctionExpression = async (
	containerName: string,
	exportName: string,
	declaration: VariableDeclaration,
): Promise<ExtractedFunction> => ({
	kind: "function",
	id: id(containerName, "+function", exportName),
	name: exportName,
	docs: docs(declaration),
	file: sourceFilePath(declaration),
	line: declaration.getStartLineNumber(),
	signature: await functionExpressionSignature(exportName, declaration),
});

const functionExpressionSignature = async (
	name: string,
	declaration: VariableDeclaration,
): Promise<string> => {
	const type = typeCheckerType(declaration);
	return await formatSignature("function", `${name}: ${type}`);
};
