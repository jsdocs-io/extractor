import { beforeAll, describe, expect, it } from "vitest";
import { extractPackageAPI } from "../../src/api-extractor/extract-package-api";
import type { PackageAPI } from "../../src/types/package-api";

import { getTestFileSystem } from "../helpers/get-test-file-system";

describe("interface-with-overloaded-methods", () => {
  let api: PackageAPI;

  beforeAll(async () => {
    const name = "interface-with-overloaded-methods";
    const fileSystem = getTestFileSystem({ name });
    api = await extractPackageAPI({ fileSystem, entryPoint: "index.d.ts" });
  });

  it("snapshot", () => {
    expect(api).toMatchSnapshot();
  });
});
