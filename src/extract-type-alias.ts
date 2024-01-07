import type { TypeAliasDeclaration } from "ts-morph";
import { docs } from "./docs";
import { formatSignature } from "./format-signature";
import { id } from "./id";

export type ExtractedTypeAlias = {
  kind: "type-alias";
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
  kind: "type-alias",
  id: id(containerName, "type-alias", exportName),
  name: exportName,
  docs: docs(declaration),
  file: declaration.getSourceFile().getFilePath() as string,
  line: declaration.getStartLineNumber(),
  signature: await typeAliasSignature(declaration),
});

const typeAliasSignature = (
  declaration: TypeAliasDeclaration,
): Promise<string> => {
  const type = declaration.getText();
  return formatSignature("type-alias", type);
};
