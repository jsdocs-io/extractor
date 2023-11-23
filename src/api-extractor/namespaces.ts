import * as tsm from "ts-morph";
import {
  ModuleDeclarations,
  NamespaceDeclaration,
} from "../types/module-declarations";
import { formatText } from "./format";
import { getJSDocs } from "./get-jsdocs";
import { SourceProvider } from "./source-provider";

export function isNamespace(
  declaration: tsm.Node,
): declaration is tsm.ModuleDeclaration {
  return tsm.Node.isModuleDeclaration(declaration);
}

export function newNamespace({
  id,
  name,
  declaration,
  declarations,
  getSource,
}: {
  id: string;
  name: string;
  declaration: tsm.ModuleDeclaration;
  declarations: ModuleDeclarations;
  getSource: SourceProvider;
}): NamespaceDeclaration {
  const docs = getJSDocs({ declaration });
  const source = getSource({ declaration });
  const signature = getNamespaceSignature({ id, name });

  return {
    kind: "namespace",
    id,
    name: id,
    docs,
    source,
    signature,
    declarations,
  };
}

function getNamespaceSignature({
  id,
  name,
}: {
  id: string;
  name: string;
}): string {
  const signature = isAmbientModule({ name })
    ? `module ${name} {}`
    : `namespace ${id} {}`;
  return formatText(signature);
}

function isAmbientModule({ name }: { name: string }): boolean {
  return name.startsWith("'") || name.startsWith('"');
}
