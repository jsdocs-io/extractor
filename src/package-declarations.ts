import { ResultAsync } from "neverthrow";
import type { Project, SourceFile } from "ts-morph";
import { PackageDeclarationsError } from "./errors";
import {
  extractDeclarations,
  type ExtractedDeclaration,
} from "./extract-declarations";

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
  ExtractedDeclaration[],
  PackageDeclarationsError
> =>
  ResultAsync.fromPromise(
    extractDeclarations({
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
