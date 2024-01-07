import type { VariableDeclaration } from "ts-morph";
import { docs } from "./docs";
import type { ExtractedFunction } from "./extract-function";
import { formatSignature } from "./format-signature";
import { id } from "./id";
import { typeCheckerType } from "./type-checker-type";

export const extractFunctionExpression = async (
  containerName: string,
  exportName: string,
  declaration: VariableDeclaration,
): Promise<ExtractedFunction> => ({
  kind: "function",
  id: id(containerName, "function", exportName),
  name: exportName,
  docs: docs(declaration),
  file: declaration.getSourceFile().getFilePath() as string,
  line: declaration.getStartLineNumber(),
  signature: await functionExpressionSignature(exportName, declaration),
});

const functionExpressionSignature = (
  name: string,
  declaration: VariableDeclaration,
): Promise<string> => {
  const type = typeCheckerType(declaration);
  return formatSignature("function", `${name}: ${type}`);
};
