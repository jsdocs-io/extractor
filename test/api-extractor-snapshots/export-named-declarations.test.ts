import { beforeAll, describe, expect, it } from "vitest";
import { extractPackageAPI } from "../../src/api-extractor/extract-package-api";
import type { PackageAPI } from "../../src/types/package-api";

import { getTestFileSystem } from "../helpers/get-test-file-system";

describe("export-named-declarations", () => {
  let api: PackageAPI;

  beforeAll(() => {
    const name = "export-named-declarations";
    const fileSystem = getTestFileSystem({ name });
    api = extractPackageAPI({ fileSystem, entryPoint: "index.ts" });
  });

  it("snapshot", () => {
    expect(api).toMatchSnapshot();
  });
});

describe("export-named-declarations with repository", () => {
  let api: PackageAPI;

  beforeAll(() => {
    const name = "export-named-declarations";
    const fileSystem = getTestFileSystem({ name });
    const repository = {
      url: "test/repo",
      shortcut: "",
      tarball: "",
    };
    api = extractPackageAPI({
      fileSystem,
      entryPoint: "index.ts",
      repository,
    });
  });

  it("snapshot", () => {
    expect(api).toMatchSnapshot();
  });
});
