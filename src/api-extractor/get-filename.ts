import * as tsm from "ts-morph";

export function getFilename({
  declaration,
}: {
  declaration: tsm.Node;
}): string {
  // Remove leading `/` from filepath
  return declaration.getSourceFile().getFilePath().replace(/^\//, "");
}
