import { ModuleDeclaration } from "ts-morph";
import { docs } from "./docs";
import type { ExtractedDeclaration } from "./extract-declarations";
import { formatSignature } from "./format-signature";
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
  declarations: ExtractedDeclaration[];
};

export const extractNamespace = async (
  containerName: string,
  exportName: string,
  declaration: ModuleDeclaration,
  declarations: ExtractedDeclaration[],
): Promise<ExtractedNamespace> => ({
  kind: "namespace",
  id: id(containerName, "namespace", exportName),
  name: exportName,
  docs: docs(declaration),
  file: sourceFilePath(declaration),
  line: declaration.getStartLineNumber(),
  signature: await namespaceSignature(exportName),
  declarations,
});

const namespaceSignature = (exportName: string): Promise<string> => {
  const signature = `namespace ${exportName} {}`;
  return formatSignature("namespace", signature);
};
