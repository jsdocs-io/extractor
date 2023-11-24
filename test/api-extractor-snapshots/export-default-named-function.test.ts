import { beforeAll, describe, expect, it } from "vitest";
import { extractPackageAPI } from "../../src/api-extractor/extract-package-api";
import type { PackageAPI } from "../../src/types/package-api";

import { getTestFileSystem } from "../helpers/get-test-file-system";

describe("export-default-named-function", () => {
  let api: PackageAPI;

  beforeAll(async () => {
    const name = "export-default-named-function";
    const fileSystem = getTestFileSystem({ name });
    api = await extractPackageAPI({ fileSystem, entryPoint: "index.ts" });
  });

  it("snapshot", () => {
    expect(api).toMatchSnapshot();
  });
});
