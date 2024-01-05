import type { BinaryExpression, VariableDeclaration } from "ts-morph";
import { apparentType } from "./apparent-type";
import { docs } from "./docs";
import { type ExtractedVariable } from "./extract-variable";
import { formatSignature } from "./format-signature";
import { itemId } from "./item-id";

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
    id: itemId(containerName, "variable", exportName),
    name: exportName,
    docs: docs(variableDeclaration),
    file: variableDeclaration.getSourceFile().getFilePath() as string,
    line: variableDeclaration.getStartLineNumber(),
    signature: await variableAssignmentExpressionSignature(
      exportName,
      declaration,
      variableDeclaration,
    ),
  };
};

const variableAssignmentExpressionSignature = (
  name: string,
  declaration: BinaryExpression,
  variableDeclaration: VariableDeclaration,
): Promise<string> => {
  const kind = variableDeclaration
    .getVariableStatementOrThrow()
    .getDeclarationKind()
    .toString();
  const variableType = apparentType(variableDeclaration);
  const expressionType = apparentType(declaration);
  const type = variableType !== "any" ? variableType : expressionType;
  return formatSignature("variable", `${kind} ${name}: ${type}`);
};
