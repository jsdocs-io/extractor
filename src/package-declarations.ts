import { ResultAsync } from "neverthrow";
import type { Project, SourceFile } from "ts-morph";
import {
  containerDeclarations,
  type ExtractedContainerDeclaration,
} from "./container-declarations";
import { PackageDeclarationsError } from "./errors";

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
}: PackageDeclarationsOptions): ResultAsync<
  ExtractedContainerDeclaration[],
  PackageDeclarationsError
> =>
  ResultAsync.fromPromise(
    containerDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth,
      project,
      pkgName,
    }),
    (e) =>
      new PackageDeclarationsError("failed to extract package declarations", {
        cause: e,
      }),
  );
