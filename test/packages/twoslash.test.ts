import { expect, test } from "vitest";
import { extractPackageApi } from "../../src";

test("twoslash@0.2.1", async () => {
  expect(
    (
      await extractPackageApi({
        pkg: "twoslash@0.2.1",
      })
    )._unsafeUnwrap(),
  ).toMatchSnapshot();
});
