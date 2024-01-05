import type { Expression } from "ts-morph";
import { apparentType } from "./apparent-type";
import { docs } from "./docs";
import type { ExtractedVariable } from "./extract-variable";
import { formatSignature } from "./format-signature";
import { itemId } from "./item-id";

export const extractExpression = async (
  containerName: string,
  exportName: string,
  declaration: Expression,
): Promise<ExtractedVariable> => ({
  kind: "variable",
  id: itemId(containerName, exportName),
  name: exportName,
  docs: docs(declaration),
  file: declaration.getSourceFile().getFilePath() as string,
  line: declaration.getStartLineNumber(),
  signature: await expressionSignature(exportName, declaration),
});

const expressionSignature = (
  name: string,
  declaration: Expression,
): Promise<string> => {
  const kind = "const";
  const type = apparentType(declaration);
  return formatSignature("variable", `${kind} ${name}: ${type}`);
};
