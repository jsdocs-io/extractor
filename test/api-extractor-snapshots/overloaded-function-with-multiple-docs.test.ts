import { beforeAll, describe, expect, it } from "vitest";
import { extractPackageAPI } from "../../src/api-extractor/extract-package-api";
import { PackageAPI } from "../../src/types/package-api";
import { getTestFileSystem } from "../helpers/get-test-file-system";

describe("overloaded-function-with-multiple-docs", () => {
  let api: PackageAPI;

  beforeAll(() => {
    const name = "overloaded-function-with-multiple-docs";
    const fileSystem = getTestFileSystem({ name });
    api = extractPackageAPI({ fileSystem, entryPoint: "index.d.ts" });
  });

  it("snapshot", () => {
    expect(api).toMatchSnapshot();
  });
});
