import * as tsm from "ts-morph";
import { FunctionDeclaration } from "../types/module-declarations";
import { formatFunctionSignature } from "./format";
import { getJSDocs } from "./get-jsdocs";
import { hasFunctionLikeType } from "./has-function-like-type";
import { SourceProvider } from "./source-provider";
import { TypeChecker } from "./type-checker";

export function isFunction(
  declaration: tsm.Node,
): declaration is tsm.FunctionDeclaration {
  return (
    tsm.Node.isFunctionDeclaration(declaration) &&
    (declaration.isAmbient() || declaration.isImplementation())
  );
}

export function newFunction({
  id,
  name,
  declaration,
  getSource,
  getType,
}: {
  id: string;
  name: string;
  declaration: tsm.FunctionDeclaration;
  getSource: SourceProvider;
  getType: TypeChecker;
}): FunctionDeclaration {
  const docs = getJSDocs({ declaration });
  const source = getSource({ declaration });
  const type = getType({ declaration });
  const signature = getFunctionSignature({ name, type });

  return {
    kind: "function",
    id,
    name,
    docs,
    source,
    signature,
    type,
  };
}

export function isFunctionExpression(
  declaration: tsm.Node,
): declaration is tsm.VariableDeclaration {
  return (
    tsm.Node.isVariableDeclaration(declaration) &&
    hasFunctionLikeType(declaration)
  );
}

export function newFunctionExpression({
  id,
  name,
  declaration,
  getSource,
  getType,
}: {
  id: string;
  name: string;
  declaration: tsm.VariableDeclaration;
  getSource: SourceProvider;
  getType: TypeChecker;
}): FunctionDeclaration {
  const docs = getJSDocs({ declaration });
  const source = getSource({ declaration });
  const type = getType({ declaration });
  const signature = getFunctionSignature({ name, type });

  return {
    kind: "function",
    id,
    name,
    docs,
    source,
    signature,
    type,
  };
}

function getFunctionSignature({
  name,
  type,
}: {
  name: string;
  type: string;
}): string {
  const signature = `${name}: ${type}`;
  return formatFunctionSignature(signature);
}
