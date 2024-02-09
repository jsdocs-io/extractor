import { expect, test } from "vitest";
import { extractPackageApi } from "../../src";

test("h3@1.10.1", async () => {
  expect(
    (
      await extractPackageApi({
        pkg: "h3@1.10.1",
      })
    )._unsafeUnwrap(),
  ).toMatchSnapshot();
});
