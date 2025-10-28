import { readPackage, type NormalizedPackageJson } from "read-pkg";

/** `getPackageJson` returns the `package.json` file found in the given directory. */
export async function getPackageJson(dir: string): Promise<NormalizedPackageJson> {
	return await readPackage({ cwd: dir });
}
