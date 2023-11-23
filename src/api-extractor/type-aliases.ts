import * as tsm from "ts-morph";
import type { TypeAliasDeclaration } from "../types/module-declarations";
import { getJSDocs } from "./get-jsdocs";
import type { SourceProvider } from "./source-provider";

export function isTypeAlias(
  declaration: tsm.Node,
): declaration is tsm.TypeAliasDeclaration {
  return tsm.Node.isTypeAliasDeclaration(declaration);
}

export function newTypeAlias({
  id,
  name,
  declaration,
  getSource,
}: {
  id: string;
  name: string;
  declaration: tsm.TypeAliasDeclaration;
  getSource: SourceProvider;
}): TypeAliasDeclaration {
  const docs = getJSDocs({ declaration });
  const source = getSource({ declaration });
  const signature = getTypeAliasSignature({ declaration });

  return {
    kind: "typeAlias",
    id,
    name,
    docs,
    source,
    signature,
  };
}

function getTypeAliasSignature({
  declaration,
}: {
  declaration: tsm.TypeAliasDeclaration;
}): string {
  const signature = declaration.getText();
  return signature;
}
