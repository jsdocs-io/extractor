import { Node, SyntaxKind } from "ts-morph";
import { nodeDocs } from "./node-docs";
import { parseDocComment } from "./parse-doc-comment";

export const isHidden = (node: Node, name = ""): boolean =>
  name.startsWith("_") ||
  name.startsWith("#") ||
  hasPrivateModifier(node) ||
  hasDocWithInternalTag(node);

const hasPrivateModifier = (node: Node): boolean =>
  Node.isModifierable(node) && node.hasModifier(SyntaxKind.PrivateKeyword);

const hasDocWithInternalTag = (node: Node): boolean =>
  nodeDocs(node).some((doc) =>
    parseDocComment(doc).modifierTagSet.isInternal(),
  );
