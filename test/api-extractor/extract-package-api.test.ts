import * as tsm from "ts-morph";
import { describe, expect, it } from "vitest";
import { extractPackageAPI } from "../../src/api-extractor/extract-package-api";
import { getTestFileSystem } from "../helpers/get-test-file-system";

describe("extractPackageAPI", () => {
  it("throws when when no index file is found", () => {
    expect.assertions(1);

    const fileSystem = new tsm.InMemoryFileSystemHost();
    try {
      extractPackageAPI({ fileSystem, entryPoint: "invalid.ts" });
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it("resolves when it finds an index file, even if empty", () => {
    expect.assertions(1);

    const name = "empty-index-file";
    const fileSystem = getTestFileSystem({ name });
    const api = extractPackageAPI({
      fileSystem,
      entryPoint: "index.ts",
      pattern: "**/index.ts",
      maxDepth: 2,
    });
    expect(api).toBeDefined();
  });

  it("ignores ambient modules in `node_modules`", () => {
    expect.assertions(1);

    const fileSystem = new tsm.InMemoryFileSystemHost();
    fileSystem.writeFileSync("index.d.ts", "");
    fileSystem.writeFileSync(
      "/node_modules/index.d.ts",
      'declare module "foo" { export const x: string; }',
    );

    const api = extractPackageAPI({ fileSystem, entryPoint: "index.d.ts" });
    expect(api.declarations.namespaces).toEqual([]);
  });
});
