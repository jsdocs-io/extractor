import { expect, test } from "vitest";
import { extractPackageApi } from "../../src";

test("faastjs@8.0.64", async () => {
  expect(
    (
      await extractPackageApi({
        pkg: "faastjs@8.0.64",
      })
    )._unsafeUnwrap(),
  ).toMatchSnapshot();
});
