import { $ } from "execa";
import { readPackage } from "read-pkg";
import { temporaryDirectoryTask } from "tempy";
import { nameFromPackage } from "./name-from-package";
import { resolveTypes } from "./resolve-types";

export const extractApiFromPackage = async (
  pkg: string,
  pkgSubpath = ".",
): Promise<unknown | undefined> => {
  const pkgName = nameFromPackage(pkg);
  const startDir = process.cwd();
  const api = await temporaryDirectoryTask(async (dir: string) => {
    process.chdir(dir);
    console.log(process.cwd());
    await $`bun add ${pkg}`;
    const pkgJson = await readPackage({ cwd: `./node_modules/${pkgName}` });
    const entryPoint = resolveTypes(pkgJson, pkgSubpath);
    if (!entryPoint) {
      return undefined;
    }
    console.log({ entryPoint });

    // await new Promise((r) => setTimeout(r, 60000));

    return { entryPoint };
  });
  process.chdir(startDir);
  return api;
};

await extractApiFromPackage("query-registry");
