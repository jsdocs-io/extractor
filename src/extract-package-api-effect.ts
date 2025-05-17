import { Effect } from "effect";
import { performance } from "node:perf_hooks";
import { join } from "pathe";
import { createProject } from "./create-project";
import type { ExtractPackageApiOptions, PackageApi } from "./extract-package-api";
import { packageDeclarations } from "./package-declarations";
import { packageJson } from "./package-json";
import { PackageManager } from "./package-manager";
import { packageOverview } from "./package-overview";
import { packageTypes } from "./package-types";
import { workDir } from "./work-dir";

/** @internal */
export const extractPackageApiEffect = ({
	pkg,
	subpath = ".",
	maxDepth = 5,
}: Omit<ExtractPackageApiOptions, "bunPath">) =>
	Effect.gen(function* () {
		const startTime = performance.now();
		const { path: cwd } = yield* workDir;
		const pm = yield* PackageManager;
		const packages = yield* pm.installPackage({ pkg, cwd });
		const workDirPkgJson = yield* packageJson(cwd);
		const pkgName = Object.keys(workDirPkgJson.dependencies!)[0]!;
		const pkgDir = join(cwd, "node_modules", pkgName);
		const pkgJson = yield* packageJson(pkgDir);
		const types = yield* packageTypes(pkgJson, subpath);
		const indexFilePath = join(pkgDir, types);
		const { project, indexFile } = yield* createProject({ indexFilePath, cwd });
		const overview = packageOverview(indexFile);
		const declarations = yield* packageDeclarations({ pkgName, project, indexFile, maxDepth });
		const pkgApi: PackageApi = {
			name: pkgJson.name,
			version: pkgJson.version,
			subpath,
			types,
			overview,
			declarations,
			packages,
			analyzedAt: new Date().toISOString(),
			analyzedIn: Math.round(performance.now() - startTime),
		};
		return pkgApi;
	});
