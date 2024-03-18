import { Effect } from "effect";
import { performance } from "node:perf_hooks";
import { join } from "pathe";
import { createProject } from "./create-project";
import type { ExtractPackageApiOptions, PackageApi } from "./extract-package-api";
import { packageDeclarations } from "./package-declarations";
import { packageJson } from "./package-json";
import { PackageManager } from "./package-manager";
import { packageName } from "./package-name";
import { packageOverview } from "./package-overview";
import { packageTypes } from "./package-types";
import { workDir } from "./work-dir";

/** @internal */
export const extractPackageApiEffect = ({
	pkg,
	subpath = ".",
	maxDepth = 5,
}: Omit<ExtractPackageApiOptions, "bunPath">) =>
	Effect.gen(function* (_) {
		const startTime = performance.now();
		const pkgName = yield* _(packageName(pkg));
		const { path: cwd } = yield* _(workDir);
		const pm = yield* _(PackageManager);
		const packages = yield* _(pm.installPackage({ pkg, cwd }));
		const pkgDir = join(cwd, "node_modules", pkgName);
		const pkgJson = yield* _(packageJson(pkgDir));
		const types = yield* _(packageTypes(pkgJson, subpath));
		const indexFilePath = join(pkgDir, types);
		const { project, indexFile } = yield* _(createProject({ indexFilePath, cwd }));
		const overview = packageOverview(indexFile);
		const declarations = yield* _(packageDeclarations({ pkgName, project, indexFile, maxDepth }));
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
