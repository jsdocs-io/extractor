import fs from "fs-extra";
import { temporaryDirectoryTask } from "tempy";
import { dedent } from "ts-dedent";
import { expect, test } from "vitest";
import { createProject } from "./create-project";
import { packageOverview } from "./package-overview";

test("no overview", async () => {
  await temporaryDirectoryTask(async (dir) => {
    process.chdir(dir);
    await fs.writeFile("./index.ts", "export {};");
    const project = createProject("./index.ts");
    expect(project.isOk()).toBe(true);
    const { indexFile } = project._unsafeUnwrap();
    expect(packageOverview(indexFile)).toBeUndefined();
  });
});

test("with overview", async () => {
  await temporaryDirectoryTask(async (dir) => {
    process.chdir(dir);
    await fs.writeFile(
      "./index.ts",
      dedent`
    /**
    @packageDocumentation
    This is the overview.
    */

    export {};
    `,
    );
    const project = createProject("./index.ts");
    expect(project.isOk()).toBe(true);
    const { indexFile } = project._unsafeUnwrap();
    expect(packageOverview(indexFile)).toBe(dedent`
    /**
    @packageDocumentation
    This is the overview.
    */
    `);
  });
});
