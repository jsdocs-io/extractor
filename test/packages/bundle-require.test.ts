import { expect, test } from "vitest";
import { extractPackageApi } from "../../src";

test("bundle-require@4.0.2", async () => {
  expect(
    (
      await extractPackageApi({
        pkg: "bundle-require@4.0.2",
      })
    )._unsafeUnwrap(),
  ).toMatchSnapshot();
});
