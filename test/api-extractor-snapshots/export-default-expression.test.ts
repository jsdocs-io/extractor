import { beforeAll, describe, expect, it } from "vitest";
import { extractPackageAPI } from "../../src/api-extractor/extract-package-api";
import type { PackageAPI } from "../../src/types/package-api";

import { getTestFileSystem } from "../helpers/get-test-file-system";

describe("export-default-expression", () => {
  let api: PackageAPI;

  beforeAll(async () => {
    const name = "export-default-expression";
    const fileSystem = getTestFileSystem({ name });
    api = await extractPackageAPI({ fileSystem, entryPoint: "index.ts" });
  });

  it("snapshot", () => {
    expect(api).toMatchSnapshot();
  });
});
