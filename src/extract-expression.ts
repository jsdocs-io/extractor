import type { Expression } from "ts-morph";
import { apparentType } from "./apparent-type.ts";
import { docs } from "./docs.ts";
import { formatSignature } from "./format-signature.ts";
import { id } from "./id.ts";
import { sourceFilePath } from "./source-file-path.ts";
import type { ExtractedVariable } from "./types.ts";

export const extractExpression = async (
	containerName: string,
	exportName: string,
	declaration: Expression,
): Promise<ExtractedVariable> => ({
	kind: "variable",
	id: id(containerName, "+variable", exportName),
	name: exportName,
	docs: docs(declaration),
	file: sourceFilePath(declaration),
	line: declaration.getStartLineNumber(),
	signature: await expressionSignature(exportName, declaration),
});

const expressionSignature = async (name: string, declaration: Expression): Promise<string> => {
	const kind = "const";
	const type = apparentType(declaration);
	return await formatSignature("variable", `${kind} ${name}: ${type}`);
};
