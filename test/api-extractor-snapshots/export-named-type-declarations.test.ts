import { beforeAll, describe, expect, it } from "vitest";
import { extractPackageAPI } from "../../src/api-extractor/extract-package-api";
import type { PackageAPI } from "../../src/types/package-api";

import { getTestFileSystem } from "../helpers/get-test-file-system";

describe("export-named-type-declarations", () => {
  let api: PackageAPI;

  beforeAll(() => {
    const name = "export-named-type-declarations";
    const fileSystem = getTestFileSystem({ name });
    api = extractPackageAPI({ fileSystem, entryPoint: "index.d.ts" });
  });

  it("snapshot", () => {
    expect(api).toMatchSnapshot();
  });
});
