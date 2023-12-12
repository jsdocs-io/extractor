import { $ } from "execa";
import { Result, ResultAsync, ok } from "neverthrow";
import { readPackage } from "read-pkg";
import { temporaryDirectoryTask } from "tempy";
import { createProject } from "./create-project";
import { nameFromPackage } from "./name-from-package";
import { resolveTypes } from "./resolve-types";

export const extractApiFromPackage = async (
  pkg: string,
  pkgSubpath = ".",
): Promise<unknown | undefined> => {
  const pkgName = nameFromPackage(pkg);
  const startDir = process.cwd();
  const api = await temporaryDirectoryTask(async (dir: string) => {
    const result = await changeDir(dir)
      .asyncAndThen(() => installPackage(pkg))
      .andThen(() => readPackageJson(`./node_modules/${pkgName}`))
      .andThen((pkgJson) => resolveTypes(pkgJson, pkgSubpath))
      .andThen((entryPoint) =>
        createProject(`./node_modules/${pkgName}/${entryPoint}`),
      )
      .andThen((project) => {
        // Debug
        const sfs = project
          .getSourceFiles()
          .map((sf) => sf.getFilePath().replace(`${dir}/node_modules/`, ""));
        console.log(JSON.stringify(sfs, null, 2));
        return ok(null);
      });
    console.log({ result });

    // await new Promise((r) => setTimeout(r, 60000));

    return {};
  });
  changeDir(startDir);
  return api;
};

const changeDir = Result.fromThrowable(
  process.chdir,
  (e) => new Error(`changeDir: failed to change directory: ${e}`),
);

const installPackage = (pkg: string) =>
  ResultAsync.fromPromise(
    $`bun add ${pkg}`,
    (e) => new Error(`installPackage: failed to install package: ${e}`),
  );

const readPackageJson = (cwd: string) =>
  ResultAsync.fromPromise(
    readPackage({ cwd }),
    (e) => new Error(`readPackageJson: failed to read package.json: ${e}`),
  );

// await extractApiFromPackage("query-registry");
// await extractApiFromPackage("preact", "hooks");
// await extractApiFromPackage("exome");
// await extractApiFromPackage("exome", "vue");
// await extractApiFromPackage("highlight-words");
// await extractApiFromPackage("short-time-ago");
// await extractApiFromPackage("short-time-ago", "foo"); // Expected Error
