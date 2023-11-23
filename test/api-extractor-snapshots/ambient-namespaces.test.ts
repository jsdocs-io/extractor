import { beforeAll, describe, expect, it } from "vitest";
import { extractPackageAPI } from "../../src/api-extractor/extract-package-api";
import type { PackageAPI } from "../../src/types/package-api";
import { getTestFileSystem } from "../helpers/get-test-file-system";

describe("ambient-namespaces", () => {
  let api: PackageAPI;

  beforeAll(() => {
    const name = "ambient-namespaces";
    const fileSystem = getTestFileSystem({ name });
    api = extractPackageAPI({ fileSystem, entryPoint: "index.d.ts" });
  });

  it("snapshot", () => {
    expect(api).toMatchSnapshot();
  });
});
