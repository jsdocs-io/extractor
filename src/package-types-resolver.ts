import { exports } from "@es-joy/resolve.exports";
import { goTry } from "go-go-try";
import type { NormalizedPackageJson } from "read-pkg";

export class PackageTypesResolver {
	#pkgJson;
	#subpath;

	constructor(pkgJson: Partial<NormalizedPackageJson>, subpath = ".") {
		this.#pkgJson = pkgJson;
		this.#subpath = subpath.trim();
	}

	getTypes(): string | undefined {
		return this.getExportsMapTypes() ?? this.getTypesOrTypings();
	}

	getExportsMapTypes(): string | undefined {
		// Try to resolve the `exports` map in `package.json`
		// with conditions `import` and `types` enabled to find
		// a valid TypeScript type definitions file.
		const [err, entries = []] = goTry(() =>
			exports(this.#pkgJson, this.#subpath, {
				conditions: ["!default", "!node", "import", "types"],
			}),
		);

		// The package may not have an `exports` map.
		if (err !== undefined) return undefined;

		// Return first entry, if valid.
		const entry = entries.at(0);
		if (!entry || !this.#isTypesFile(entry)) return undefined;
		return entry;
	}

	getTypesOrTypings(): string | undefined {
		// Try to find the `package.json#/types` (or `typings`) file
		// but accept it only to describe the types for the root subpath.
		if (!this.isRootSubpath()) return undefined;
		const entry = this.#pkgJson.types || this.#pkgJson.typings;
		if (!entry || !this.#isTypesFile(entry)) return undefined;
		return entry;
	}

	isRootSubpath(): boolean {
		return [".", this.#pkgJson.name].includes(this.#subpath);
	}

	#isTypesFile(filename: string): boolean {
		return [".d.ts", ".d.mts", ".d.cts"].some((ext) => filename.endsWith(ext));
	}
}
