import * as tsm from "ts-morph";
import { hasFunctionLikeType } from "./has-function-like-type";

export function hasVarLikeType(node: tsm.VariableDeclaration): boolean {
  return !hasFunctionLikeType(node);
}
