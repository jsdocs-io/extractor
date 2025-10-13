import type { VariableDeclaration } from "ts-morph";
import { docs } from "./docs.ts";
import { formatSignature } from "./format-signature.ts";
import { id } from "./id.ts";
import { sourceFilePath } from "./source-file-path.ts";
import { typeCheckerType } from "./type-checker-type.ts";
import type { ExtractedFunction } from "./types.ts";

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
