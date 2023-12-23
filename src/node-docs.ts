import { Node, SyntaxKind } from "ts-morph";
import { parseDocComment } from "./parse-doc-comment";

export const nodeDocs = (node: Node): string[] => [
  // List of unique jsdoc comments that are closest to the node.
  ...new Set(nodesWithDocs(node).flatMap((node) => lastDoc(node) ?? [])),
];

const nodesWithDocs = (node: Node): Node[] => {
  // A node may not have the jsdoc comment directly attached to it in the AST.
  // Let's find the nodes that do so starting from the given node.
  switch (true) {
    case Node.isVariableDeclaration(node): {
      return [node.getVariableStatementOrThrow()];
    }
    case Node.isExpression(node): {
      return [node.getParent()!];
    }
    case Node.isOverloadable(node) && !Node.isConstructorDeclaration(node): {
      // Functions and class methods can be overloaded with each declaration
      // having its own doc. Since we return overloaded declarations grouped
      // into one item, we need this item to share the docs of all overloads.
      // Constructors can also be overloaded but they are excluded because
      // one item is returned per constructor each with its own docs.
      const impl = node.getImplementation();
      return [...node.getOverloads(), ...(impl ? [impl] : [])];
    }
    case Node.isMethodSignature(node) &&
      node.getParent().getKind() === SyntaxKind.InterfaceDeclaration: {
      // Treat interface methods like overloadable class methods above.
      const methodName = node.getName();
      const overloads = node
        .getParentIfKindOrThrow(SyntaxKind.InterfaceDeclaration)
        .getMethods()
        .filter((method) => method.getName() === methodName);
      return overloads;
    }
    default: {
      return [node];
    }
  }
};

const lastDoc = (node: Node): string | undefined => {
  // Get the jsdoc comment closest to the node.
  const doc = node.getLastChildByKind(SyntaxKind.JSDoc)?.getText();
  if (!doc) {
    return undefined;
  }
  if (parseDocComment(doc).modifierTagSet.isPackageDocumentation()) {
    // The first declaration after package documentation should not
    // inherit that unrelated jsdoc comment if it has none itself.
    // See `export-named-declaration-without-jsdoc.test.ts`.
    return undefined;
  }
  return doc;
};
