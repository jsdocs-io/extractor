import fs from "fs-extra";
import { temporaryDirectoryTask } from "tempy";
import dedent from "ts-dedent";
import { Node } from "ts-morph";
import { expect, test } from "vitest";
import { createProject } from "./create-project";
import { isShorthandAmbientModule } from "./is-shorthand-ambient-module";

test("not shorthand ambient module", async () => {
  await temporaryDirectoryTask(async (dir) => {
    process.chdir(dir);
    await fs.writeFile(
      "./index.ts",
      dedent`
      export function foo() {}
    `,
    );
    const project = createProject("./index.ts");
    expect(project.isOk()).toBe(true);
    const { indexFile } = project._unsafeUnwrap();
    const foo = indexFile.getExportedDeclarations().get("foo")?.at(0)!;
    expect(Node.isFunctionDeclaration(foo)).toBe(true);
    expect(isShorthandAmbientModule(foo)).toBe(false);
  });
});

test("shorthand ambient module", async () => {
  await temporaryDirectoryTask(async (dir) => {
    process.chdir(dir);
    await fs.writeFile(
      "./index.ts",
      dedent`
      declare module 'foo';
    `,
    );
    const project = createProject("./index.ts");
    expect(project.isOk()).toBe(true);
    const { indexFile } = project._unsafeUnwrap();
    const foo = indexFile.getModuleOrThrow("'foo'");
    expect(Node.isModuleDeclaration(foo)).toBe(true);
    expect(isShorthandAmbientModule(foo)).toBe(true);
  });
});
