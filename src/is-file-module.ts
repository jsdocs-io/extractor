import { Node, type SourceFile } from "ts-morph";

export const isFileModule = (node: Node): node is SourceFile => Node.isSourceFile(node);
