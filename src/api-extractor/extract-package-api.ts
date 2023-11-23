import { performance } from "perf_hooks";
import * as tsm from "ts-morph";
import { PackageAPI } from "../types/package-api";
import { TaggedGitRepository } from "../types/tagged-git-repository";
import { log } from "../utils/log";
import { getOverview } from "./get-overview";
import { getPackageDeclarations } from "./get-package-declarations";
import { getPackageFiles } from "./get-package-files";
import { getProject } from "./get-project";
import { getRepositoryFileURLProvider } from "./repository-file-url-provider";
import { getSourceProvider } from "./source-provider";
import { getTypeChecker } from "./type-checker";
import { getUnpkgFileURLProvider } from "./unpkg-file-url-provider";

/**
 * `extractPackageAPI` extracts the public API from a package.
 *
 * @param fileSystem - filesystem containing the package's source code
 * @param entryPoint - absolute path of the file acting as the package's entry point
 * @param maxDepth - maximum depth for analyzing nested namespaces (default: `5`)
 * @param pattern - file pattern including files to be analyzed
 * @param repository - a tagged git repository to enable linking to source
 * @param id - npm-style package ID used for logging (for example, `foo@1.0.0`)
 *
 * @see {@link PackageAPI}
 */
export function extractPackageAPI({
  fileSystem,
  entryPoint,
  maxDepth,
  pattern,
  repository,
  id,
}: {
  fileSystem: tsm.FileSystemHost;
  entryPoint: string;
  maxDepth?: number;
  pattern?: string;
  repository?: TaggedGitRepository;
  id?: string;
}): PackageAPI {
  const start = performance.now();
  log("extractPackageAPI: extracting API: %O", {
    id,
    entryPoint,
    maxDepth,
    pattern,
    repository,
    fileSystem,
  });

  const project = getProject({ fileSystem, pattern });
  log("extractPackageAPI: created project: %O", {
    id,
    files: project.getSourceFiles().map((file) => file.getFilePath()),
  });

  const indexFile = project.getSourceFileOrThrow(entryPoint);
  log("extractPackageAPI: found index file: %O", {
    id,
    indexFile: indexFile.getFilePath(),
  });

  const getRepositoryFileURL = getRepositoryFileURLProvider({ repository });
  log("extractPackageAPI: got repository file URL provider");

  const getUnpkgFileURL = getUnpkgFileURLProvider({ id });
  log("extractPackageAPI: got unpkg file URL provider");

  const getSource = getSourceProvider({
    getRepositoryFileURL,
    getUnpkgFileURL,
  });
  log("extractPackageAPI: got source provider");

  const getType = getTypeChecker({ project });
  log("extractPackageAPI: got type checker");

  const overview = getOverview({ indexFile });
  log("extractPackageAPI: got package overview: %O", { id, overview });

  const declarations = getPackageDeclarations({
    project,
    indexFile,
    maxDepth,
    getSource,
    getType,
  });
  log("extractPackageAPI: got package declarations: %O", {
    id,
    declarations,
  });

  const files = getPackageFiles({
    indexFile,
    declarations,
    getRepositoryFileURL,
    getUnpkgFileURL,
  });
  log("extractPackageAPI: got package files: %O", { id, files });

  const elapsed = Math.round(performance.now() - start);
  log("extractPackageAPI: performance (ms): %O", { id, elapsed });

  log("extractPackageAPI: extracted package API: %O", {
    id,
    api: { overview, declarations, files },
  });

  return { overview, declarations, files };
}
