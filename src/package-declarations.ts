import type { Project, SourceFile } from "ts-morph";
import { containerDeclarations } from "./container-declarations";

export type PackageDeclarationsOptions = {
  project: Project;
  indexFile: SourceFile;
  maxDepth: number;
};

export const packageDeclarations = ({
  project,
  indexFile,
  maxDepth,
}: PackageDeclarationsOptions) =>
  containerDeclarations({
    project,
    container: indexFile,
    containerName: "",
    maxDepth,
    extractAmbientModules: true,
  });
