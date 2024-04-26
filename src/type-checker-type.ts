import { TypeFormatFlags, type Node } from "ts-morph";

export const typeCheckerType = (node: Node): string => {
	try {
		const typeChecker = node.getProject().getTypeChecker().compilerObject;
		const nodeType = typeChecker.getTypeAtLocation(node.compilerNode);
		return typeChecker.typeToString(
			nodeType,
			node.compilerNode,
			TypeFormatFlags.NoTruncation | TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
		);
	} catch {
		return "any";
	}
};
