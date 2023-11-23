import * as tsm from "ts-morph";

export function getStartLineNumber({
  declaration,
}: {
  declaration: tsm.Node;
}): number {
  if (tsm.Node.isSourceFile(declaration)) {
    return 1;
  }

  return declaration.getStartLineNumber();
}
