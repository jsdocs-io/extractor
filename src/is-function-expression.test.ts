import fs from "fs-extra";
import { temporaryDirectoryTask } from "tempy";
import dedent from "ts-dedent";
import { Node } from "ts-morph";
import { expect, test } from "vitest";
import { createProject } from "./create-project";
import { isFunctionExpression } from "./is-function-expression";

test("not function expression", async () => {
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
    expect(isFunctionExpression(foo)).toBe(false);
  });
});

test("function expression", async () => {
  await temporaryDirectoryTask(async (dir) => {
    process.chdir(dir);
    await fs.writeFile(
      "./index.ts",
      dedent`
      export const foo = () => {};
      export const bar = function() {}
      export const baz: () => void;
    `,
    );
    const project = createProject("./index.ts");
    expect(project.isOk()).toBe(true);
    const { indexFile } = project._unsafeUnwrap();
    const foo = indexFile.getExportedDeclarations().get("foo")?.at(0)!;
    const bar = indexFile.getExportedDeclarations().get("bar")?.at(0)!;
    const baz = indexFile.getExportedDeclarations().get("baz")?.at(0)!;
    expect(Node.isVariableDeclaration(foo)).toBe(true);
    expect(Node.isVariableDeclaration(bar)).toBe(true);
    expect(Node.isVariableDeclaration(baz)).toBe(true);
    expect(isFunctionExpression(foo)).toBe(true);
    expect(isFunctionExpression(bar)).toBe(true);
    expect(isFunctionExpression(baz)).toBe(true);
  });
});
