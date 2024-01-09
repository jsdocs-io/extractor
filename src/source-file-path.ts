import type { Node } from "ts-morph";

export const sourceFilePath = (node: Node): string => {
  return node.getSourceFile().getFilePath();
};
