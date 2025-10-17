import type { NormalizedPackageJson } from "read-pkg";
import { exports } from "resolve.exports";

export class PackageTypesResolver {
	#pkgJson: Partial<NormalizedPackageJson>;
	#subpath: string;

	constructor(pkgJson: Partial<NormalizedPackageJson>, subpath: string) {
		this.#pkgJson = pkgJson;
		this.#subpath = subpath.trim();
	}

	resolveTypes(): string | undefined {
		return this.resolveExportsMapTypes() ?? this.resolveTypesOrTypings();
	}

	resolveExportsMapTypes(): string | undefined {
		try {
			const entries =
				exports(this.#pkgJson, this.#subpath, {
					conditions: ["types", "import", "node"],
					unsafe: true,
				}) ?? [];
			const entry = entries.at(0);
			if (!entry || !this.isTypesFile(entry)) return undefined;
			return entry;
		} catch {
			// The package may not have an `exports` map.
			return undefined;
		}
	}

	resolveTypesOrTypings(): string | undefined {
		// Try to find the `package.json#/types` (or `typings`) file
		// but accept it only to describe the types for the root subpath.
		if (!this.isRootSubpath()) return undefined;
		const entry = this.#pkgJson.types || this.#pkgJson.typings;
		if (!entry || !this.isTypesFile(entry)) return undefined;
		return entry;
	}

	isRootSubpath(): boolean {
		return [".", this.#pkgJson.name].includes(this.#subpath);
	}

	isTypesFile(filename: string): boolean {
		return [".d.ts", ".d.mts", ".d.cts"].some((ext) => filename.endsWith(ext));
	}
}
