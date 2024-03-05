import type { ArrowFunction, FunctionDeclaration } from "ts-morph";
import { docs } from "./docs";
import { formatSignature } from "./format-signature";
import { id } from "./id";
import { sourceFilePath } from "./source-file-path";
import { typeCheckerType } from "./type-checker-type";

export type ExtractedFunction = {
	kind: "function";
	id: string;
	name: string;
	docs: string[];
	file: string;
	line: number;
	signature: string;
};

export const extractFunction = async (
	containerName: string,
	exportName: string,
	declaration: FunctionDeclaration | ArrowFunction,
): Promise<ExtractedFunction> => ({
	kind: "function",
	id: id(containerName, "function", exportName),
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
	return formatSignature("function", `${name}: ${type}`);
};
