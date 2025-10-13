import type { ArrowFunction, FunctionDeclaration } from "ts-morph";
import { docs } from "./docs.ts";
import { formatSignature } from "./format-signature.ts";
import { id } from "./id.ts";
import { sourceFilePath } from "./source-file-path.ts";
import { typeCheckerType } from "./type-checker-type.ts";
import type { ExtractedFunction } from "./types.ts";

export const extractFunction = async (
	containerName: string,
	exportName: string,
	declaration: FunctionDeclaration | ArrowFunction,
): Promise<ExtractedFunction> => ({
	kind: "function",
	id: id(containerName, "+function", exportName),
	name: exportName,
	docs: docs(declaration),
	file: sourceFilePath(declaration),
	line: declaration.getStartLineNumber(),
	signature: await functionSignature(exportName, declaration),
});

const functionSignature = async (
	name: string,
	declaration: FunctionDeclaration | ArrowFunction,
): Promise<string> => {
	const type = typeCheckerType(declaration);
	return await formatSignature("function", `${name}: ${type}`);
};
