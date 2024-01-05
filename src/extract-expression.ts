import type { Expression } from "ts-morph";
import { apparentType } from "./apparent-type";
import { docs } from "./docs";
import type { ExtractedVariable } from "./extract-variable";
import { formatSignature } from "./format-signature";
import { id } from "./id";

export const extractExpression = async (
  containerName: string,
  exportName: string,
  declaration: Expression,
): Promise<ExtractedVariable> => ({
  kind: "variable",
  id: id(containerName, "variable", exportName),
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
