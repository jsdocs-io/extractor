import type { Project, SourceFile } from "ts-morph";
import { containerDeclarations } from "./container-declarations";

export type PackageDeclarationsOptions = {
  pkgName: string;
  project: Project;
  indexFile: SourceFile;
  maxDepth: number;
};

export const packageDeclarations = ({
  pkgName,
  project,
  indexFile,
  maxDepth,
}: PackageDeclarationsOptions) =>
  containerDeclarations({
    containerName: "",
    container: indexFile,
    maxDepth,
    project,
    pkgName,
  });
