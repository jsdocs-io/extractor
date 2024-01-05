import type { VariableDeclaration } from "ts-morph";
import { apparentType } from "./apparent-type";
import { docs } from "./docs";
import { formatSignature } from "./format-signature";
import { itemId } from "./item-id";

export type ExtractedVariable = {
  kind: "variable";
  id: string;
  name: string;
  docs: string[];
  file: string;
  line: number;
  signature: string;
};

export const extractVariable = async (
  containerName: string,
  exportName: string,
  declaration: VariableDeclaration,
): Promise<ExtractedVariable> => ({
  kind: "variable",
  id: itemId(containerName, exportName),
  name: exportName,
  docs: docs(declaration),
  file: declaration.getSourceFile().getFilePath() as string,
  line: declaration.getStartLineNumber(),
  signature: await variableSignature(exportName, declaration),
});

const variableSignature = (
  name: string,
  declaration: VariableDeclaration,
): Promise<string> => {
  const kind = declaration
    .getVariableStatementOrThrow()
    .getDeclarationKind()
    .toString();
  const type = apparentType(declaration);
  return formatSignature("variable", `${kind} ${name}: ${type}`);
};
