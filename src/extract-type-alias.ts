import type { TypeAliasDeclaration } from "ts-morph";
import { docs } from "./docs";
import { formatSignature } from "./format-signature";
import { id } from "./id";
import { sourceFilePath } from "./source-file-path";

export type ExtractedTypeAlias = {
  kind: "type";
  id: string;
  name: string;
  docs: string[];
  file: string;
  line: number;
  signature: string;
};

export const extractTypeAlias = async (
  containerName: string,
  exportName: string,
  declaration: TypeAliasDeclaration,
): Promise<ExtractedTypeAlias> => ({
  kind: "type",
  id: id(containerName, "type", exportName),
  name: exportName,
  docs: docs(declaration),
  file: sourceFilePath(declaration),
  line: declaration.getStartLineNumber(),
  signature: await typeAliasSignature(declaration),
});

const typeAliasSignature = async (
  declaration: TypeAliasDeclaration,
): Promise<string> => {
  const signature = declaration.getText();
  return formatSignature("type", signature);
};
