import fs from "fs-extra";
import { temporaryDirectoryTask } from "tempy";
import dedent from "ts-dedent";
import { ClassDeclaration, FunctionDeclaration, Node } from "ts-morph";
import { expect, test } from "vitest";
import { createProject } from "./create-project";
import { isHidden } from "./is-hidden";

test("private properties", async () => {
  await temporaryDirectoryTask(async (dir) => {
    process.chdir(dir);
    await fs.writeFile(
      "./index.ts",
      dedent`
      export class Foo {
        bar;
        #baz;
        #qux() {}

        static staticBar;
        static #staticBaz;
        static #staticQux() {}
      }
    `,
    );
    const project = createProject("./index.ts");
    expect(project.isOk()).toBe(true);
    const { indexFile } = project._unsafeUnwrap();
    const foo = indexFile
      .getExportedDeclarations()
      .get("Foo")
      ?.at(0)! as ClassDeclaration;
    expect(Node.isClassDeclaration(foo)).toBe(true);
    const bar = foo.getPropertyOrThrow("bar");
    const baz = foo.getPropertyOrThrow("#baz");
    const qux = foo.getMethodOrThrow("#qux");
    expect(isHidden(bar)).toBe(false);
    expect(isHidden(baz)).toBe(true);
    expect(isHidden(qux)).toBe(true);
    const staticBar = foo.getPropertyOrThrow("staticBar");
    const staticBaz = foo.getPropertyOrThrow("#staticBaz");
    const staticQux = foo.getMethodOrThrow("#staticQux");
    expect(isHidden(staticBar)).toBe(false);
    expect(isHidden(staticBaz)).toBe(true);
    expect(isHidden(staticQux)).toBe(true);
  });
});

test("private modifier", async () => {
  await temporaryDirectoryTask(async (dir) => {
    process.chdir(dir);
    await fs.writeFile(
      "./index.ts",
      dedent`
      export class Foo {
        bar;
        private baz;
        private qux() {}

        static staticBar;
        private static staticBaz;
        static private staticQux() {}
      }
    `,
    );
    const project = createProject("./index.ts");
    expect(project.isOk()).toBe(true);
    const { indexFile } = project._unsafeUnwrap();
    const foo = indexFile
      .getExportedDeclarations()
      .get("Foo")
      ?.at(0)! as ClassDeclaration;
    expect(Node.isClassDeclaration(foo)).toBe(true);
    const bar = foo.getPropertyOrThrow("bar");
    const baz = foo.getPropertyOrThrow("baz");
    const qux = foo.getMethodOrThrow("qux");
    expect(isHidden(bar)).toBe(false);
    expect(isHidden(baz)).toBe(true);
    expect(isHidden(qux)).toBe(true);
    const staticBar = foo.getPropertyOrThrow("staticBar");
    const staticBaz = foo.getPropertyOrThrow("staticBaz");
    const staticQux = foo.getMethodOrThrow("staticQux");
    expect(isHidden(staticBar)).toBe(false);
    expect(isHidden(staticBaz)).toBe(true);
    expect(isHidden(staticQux)).toBe(true);
  });
});

test("internal tag", async () => {
  await temporaryDirectoryTask(async (dir) => {
    process.chdir(dir);
    await fs.writeFile(
      "./index.ts",
      dedent`
      export function foo() {}

      /** @internal */
      export function bar() {}
    `,
    );
    const project = createProject("./index.ts");
    expect(project.isOk()).toBe(true);
    const { indexFile } = project._unsafeUnwrap();
    const foo = indexFile
      .getExportedDeclarations()
      .get("foo")
      ?.at(0)! as FunctionDeclaration;
    const bar = indexFile
      .getExportedDeclarations()
      .get("bar")
      ?.at(0)! as FunctionDeclaration;
    expect(Node.isFunctionDeclaration(foo)).toBe(true);
    expect(Node.isFunctionDeclaration(bar)).toBe(true);
    expect(isHidden(foo)).toBe(false);
    expect(isHidden(bar)).toBe(true);
  });
});
