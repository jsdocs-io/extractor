import { ModuleDeclaration } from "ts-morph";
import { docs } from "./docs";
import { formatSignature } from "./format-signature";
import { headText } from "./head-text";
import { id } from "./id";
import { sourceFilePath } from "./source-file-path";

export type ExtractedNamespace = {
  kind: "namespace";
  id: string;
  name: string;
  docs: string[];
  file: string;
  line: number;
  signature: string;
  // TODO:
  declarations: unknown[];
};

export const extractNamespace = async (
  containerName: string,
  exportName: string,
  declaration: ModuleDeclaration,
  // TODO:
  declarations: unknown[],
): Promise<ExtractedNamespace> => ({
  kind: "namespace",
  id: id(containerName, "namespace", exportName),
  name: exportName,
  docs: docs(declaration),
  file: sourceFilePath(declaration),
  line: declaration.getStartLineNumber(),
  signature: await namespaceSignature(declaration),
  declarations,
});

const namespaceSignature = (
  declaration: ModuleDeclaration,
): Promise<string> => {
  const signature = headText(declaration);
  return formatSignature("namespace", signature);
};