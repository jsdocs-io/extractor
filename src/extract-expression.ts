import type { Expression } from "ts-morph";
import { apparentType } from "./apparent-type";
import { docs } from "./docs";
import type { ExtractedVariable } from "./extract-variable";
import { formatSignature } from "./format-signature";
import { id } from "./id";
import { sourceFilePath } from "./source-file-path";

export const extractExpression = async (
  containerName: string,
  exportName: string,
  declaration: Expression,
): Promise<ExtractedVariable> => ({
  kind: "variable",
  id: id(containerName, "variable", exportName),
  name: exportName,
  docs: docs(declaration),
  file: sourceFilePath(declaration),
  line: declaration.getStartLineNumber(),
  signature: await expressionSignature(exportName, declaration),
});

const expressionSignature = async (
  name: string,
  declaration: Expression,
): Promise<string> => {
  const kind = "const";
  const type = apparentType(declaration);
  return formatSignature("variable", `${kind} ${name}: ${type}`);
};
