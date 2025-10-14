import type { Node } from "ts-morph";

export function sourceFilePath(node: Node): string {
	return node.getSourceFile().getFilePath().split("node_modules").pop()!;
}
