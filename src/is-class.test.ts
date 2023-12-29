import fs from "fs-extra";
import { temporaryDirectoryTask } from "tempy";
import dedent from "ts-dedent";
import { Node } from "ts-morph";
import { expect, test } from "vitest";
import { createProject } from "./create-project";
import { isClass } from "./is-class";

test("not class", async () => {
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
    expect(isClass(foo)).toBe(false);
  });
});

test("class", async () => {
  await temporaryDirectoryTask(async (dir) => {
    process.chdir(dir);
    await fs.writeFile(
      "./index.ts",
      dedent`
      export class Foo() {}
    `,
    );
    const project = createProject("./index.ts");
    expect(project.isOk()).toBe(true);
    const { indexFile } = project._unsafeUnwrap();
    const foo = indexFile.getExportedDeclarations().get("Foo")?.at(0)!;
    expect(Node.isClassDeclaration(foo)).toBe(true);
    expect(isClass(foo)).toBe(true);
  });
});
