import * as tsm from "ts-morph";
import { VariableDeclaration } from "../types/module-declarations";
import { formatVariableSignature } from "./format";
import { getApparentType } from "./get-apparent-type";
import { getJSDocs } from "./get-jsdocs";
import { hasVarLikeType } from "./has-var-like-type";
import { SourceProvider } from "./source-provider";

export function isVariable(
  declaration: tsm.Node,
): declaration is tsm.VariableDeclaration {
  return (
    tsm.Node.isVariableDeclaration(declaration) && hasVarLikeType(declaration)
  );
}

export function newVariable({
  id,
  name,
  declaration,
  getSource,
  suggestedType,
}: {
  id: string;
  name: string;
  declaration: tsm.VariableDeclaration;
  getSource: SourceProvider;
  suggestedType?: string;
}): VariableDeclaration {
  const docs = getJSDocs({ declaration });
  const source = getSource({ declaration });
  const variableKind = getVariableKind({ declaration });
  const type = getVariableType({ declaration, suggestedType });
  const signature = getVariableSignature({ variableKind, name, type });

  return {
    kind: "variable",
    id,
    name,
    docs,
    source,
    signature,
    variableKind,
    type,
  };
}

function getVariableKind({
  declaration,
}: {
  declaration: tsm.VariableDeclaration;
}): string {
  return declaration
    .getVariableStatementOrThrow()
    .getDeclarationKind()
    .toString();
}

function getVariableType({
  declaration,
  suggestedType = "any",
}: {
  declaration: tsm.VariableDeclaration;
  suggestedType?: string;
}): string {
  const apparentType = getApparentType({ declaration });
  return apparentType !== "any" ? apparentType : suggestedType;
}

export function getVariableSignature({
  variableKind,
  name,
  type,
}: {
  variableKind: string;
  name: string;
  type: string;
}): string {
  const signature = `${variableKind} ${name}: ${type}`;
  return formatVariableSignature(signature);
}
