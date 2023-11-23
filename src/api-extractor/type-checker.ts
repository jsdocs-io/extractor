import * as tsm from "ts-morph";
import { log } from "../utils/log";

export type TypeChecker = ({
  declaration,
}: {
  declaration: tsm.Node;
}) => string;

export function getTypeChecker({
  project,
}: {
  project: tsm.Project;
}): TypeChecker {
  const projectTypeChecker = project.getTypeChecker();

  return ({ declaration }) => {
    let type = "any";

    try {
      const typeChecker = projectTypeChecker.compilerObject;
      const { compilerNode } = declaration;
      const nodeType = typeChecker.getTypeAtLocation(compilerNode);
      type = typeChecker.typeToString(
        nodeType,
        compilerNode,
        tsm.ts.TypeFormatFlags.NoTruncation |
          tsm.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
      );
    } catch (err) {
      // istanbul ignore next
      log("type checker: error: %O", { err });
    }

    return type;
  };
}
