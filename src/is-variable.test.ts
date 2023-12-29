import fs from "fs-extra";
import { temporaryDirectoryTask } from "tempy";
import dedent from "ts-dedent";
import { Node } from "ts-morph";
import { expect, test } from "vitest";
import { createProject } from "./create-project";
import { isVariable } from "./is-variable";

test("not variable", async () => {
  await temporaryDirectoryTask(async (dir) => {
    process.chdir(dir);
    await fs.writeFile(
      "./index.ts",
      dedent`
      export function foo() {}
      export const bar: () => void;
    `,
    );
    const project = createProject("./index.ts");
    expect(project.isOk()).toBe(true);
    const { indexFile } = project._unsafeUnwrap();
    const foo = indexFile.getExportedDeclarations().get("foo")?.at(0)!;
    const bar = indexFile.getExportedDeclarations().get("bar")?.at(0)!;
    expect(Node.isFunctionDeclaration(foo)).toBe(true);
    expect(Node.isVariableDeclaration(bar)).toBe(true);
    expect(isVariable(foo)).toBe(false);
    expect(isVariable(bar)).toBe(false);
  });
});

test("variable", async () => {
  await temporaryDirectoryTask(async (dir) => {
    process.chdir(dir);
    await fs.writeFile(
      "./index.ts",
      dedent`
      export const foo: string;
    `,
    );
    const project = createProject("./index.ts");
    expect(project.isOk()).toBe(true);
    const { indexFile } = project._unsafeUnwrap();
    const foo = indexFile.getExportedDeclarations().get("foo")?.at(0)!;
    expect(Node.isVariableDeclaration(foo)).toBe(true);
    expect(isVariable(foo)).toBe(true);
  });
});
