import { Node, type SourceFile } from "ts-morph";

export const isModule = (node: Node): node is SourceFile =>
  Node.isSourceFile(node);
