import { expect, test } from "vitest";
import { extractPackageApi } from "../../src";

test("@supeffective/dataset@2.2.2", async () => {
  expect(
    (
      await extractPackageApi({
        pkg: "@supeffective/dataset@2.2.2",
      })
    )._unsafeUnwrap(),
  ).toMatchSnapshot();
});
