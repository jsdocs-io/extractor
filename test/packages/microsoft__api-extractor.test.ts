import { expect, test } from "vitest";
import { extractPackageApi } from "../../src";

test("@microsoft/api-extractor@7.13.0", async () => {
  expect(
    (
      await extractPackageApi({
        pkg: "@microsoft/api-extractor@7.13.0",
      })
    )._unsafeUnwrap(),
  ).toMatchSnapshot();
});
