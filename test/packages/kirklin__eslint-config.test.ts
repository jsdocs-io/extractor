import { expect, test } from "vitest";
import { extractPackageApi } from "../../src";

test("@kirklin/eslint-config@2.1.0", async () => {
  expect(
    (
      await extractPackageApi({
        pkg: "@kirklin/eslint-config@2.1.0",
      })
    )._unsafeUnwrap(),
  ).toMatchSnapshot();
});
