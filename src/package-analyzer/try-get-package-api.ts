import { PackageManifest } from "query-registry";
import { extractPackageAPI } from "../api-extractor/extract-package-api";
import { PackageAPI } from "../types/package-api";
import { log } from "../utils/log";
import { getEntryPoint } from "./get-entry-point";
import { getOptimizedFilePattern } from "./get-optimized-file-pattern";
import { getTaggedGitRepository } from "./get-tagged-git-repository";
import { hasValidLicense } from "./has-valid-license";
import { tryDownloadPackage } from "./try-download-package";

export async function tryGetPackageAPI({
  manifest,
  ignoreLicense,
  ignoreFilePatternOptimizations,
}: {
  manifest: PackageManifest;
  ignoreLicense?: boolean;
  ignoreFilePatternOptimizations?: boolean;
}): Promise<PackageAPI | undefined> {
  const {
    id,
    name,
    version,
    license,
    gitHead,
    gitRepository,
    dist: { tarball },
    source,
    types,
    typings,
  } = manifest;

  if (!hasValidLicense({ license, ignoreLicense })) {
    log("tryGetPackageAPI: invalid license: %O", { id, license });
    return undefined;
  }

  const fileSystem = await tryDownloadPackage({ tarball });
  if (!fileSystem) {
    log("tryGetPackageAPI: download failed: %O", { id, tarball });
    return undefined;
  }

  const entryPoint = getEntryPoint({
    fileSystem,
    name,
    source,
    types,
    typings,
  });
  if (!entryPoint) {
    log("tryGetPackageAPI: entry point not found: %O", {
      id,
      name,
      source,
      types,
      typings,
      fileSystem,
    });
    return undefined;
  }

  const repository = getTaggedGitRepository({
    id,
    gitRepository,
    gitHead,
    version,
  });

  const pattern = getOptimizedFilePattern({
    name,
    ignoreFilePatternOptimizations,
  });

  try {
    return extractPackageAPI({
      fileSystem,
      entryPoint,
      id,
      repository,
      pattern,
    });
  } catch (err) {
    log("tryGetPackageAPI: API extraction failed: %O", { id, err });
    return undefined;
  }
}
