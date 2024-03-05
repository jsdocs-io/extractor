import type { Node } from "ts-morph";

export const sourceFilePath = (node: Node): string =>
	node.getSourceFile().getFilePath().split("node_modules").pop()!;
