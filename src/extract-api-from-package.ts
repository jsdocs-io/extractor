import { $ } from "execa";
import { chdir, cwd } from "node:process";
import { readPackage } from "read-pkg";
import { temporaryDirectoryTask } from "tempy";
import { nameFromPackage } from "./name-from-package";
import { resolveTypes } from "./resolve-types";

export const extractApiFromPackage = async (
  pkg: string,
  subpath = ".",
): Promise<unknown> => {
  const pkgName = nameFromPackage(pkg);
  const startDir = cwd();
  const api = await temporaryDirectoryTask(async (dir: string) => {
    chdir(dir);
    console.log(cwd());
    await $`bun add ${pkg}`;
    const pkgJson = await readPackage({ cwd: `./node_modules/${pkgName}` });
    const entryPoint = resolveTypes(pkgJson, subpath);
    console.log({ entryPoint });

    // await new Promise((r) => setTimeout(r, 60000));

    return { entryPoint };
  });
  chdir(startDir);
  return api;
};

await extractApiFromPackage("query-registry");
