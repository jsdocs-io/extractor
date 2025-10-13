import type { BinaryExpression, VariableDeclaration } from "ts-morph";
import { apparentType } from "./apparent-type.ts";
import { docs } from "./docs.ts";
import { formatSignature } from "./format-signature.ts";
import { id } from "./id.ts";
import { sourceFilePath } from "./source-file-path.ts";
import type { ExtractedVariable } from "./types.ts";

export const extractVariableAssignmentExpression = async (
	containerName: string,
	exportName: string,
	declaration: BinaryExpression,
): Promise<ExtractedVariable> => {
	const variableDeclaration = declaration
		.getLeft()
		.getSymbol()!
		.getDeclarations()[0] as VariableDeclaration;
	return {
		kind: "variable",
		id: id(containerName, "+variable", exportName),
		name: exportName,
		docs: docs(variableDeclaration),
		file: sourceFilePath(variableDeclaration),
		line: variableDeclaration.getStartLineNumber(),
		signature: await variableAssignmentExpressionSignature(
			exportName,
			declaration,
			variableDeclaration,
		),
	};
};

const variableAssignmentExpressionSignature = async (
	name: string,
	declaration: BinaryExpression,
	variableDeclaration: VariableDeclaration,
): Promise<string> => {
	const kind = variableDeclaration.getVariableStatementOrThrow().getDeclarationKind().toString();
	const variableType = apparentType(variableDeclaration);
	const expressionType = apparentType(declaration);
	const type = variableType !== "any" ? variableType : expressionType;
	return await formatSignature("variable", `${kind} ${name}: ${type}`);
};
