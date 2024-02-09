import { expect, test } from "vitest";
import { extractPackageApi } from "../../src";

test("highlight-words@1.2.2", async () => {
  expect(
    (
      await extractPackageApi({
        pkg: "highlight-words@1.2.2",
      })
    )._unsafeUnwrap(),
  ).toMatchSnapshot({
    analyzedAt: expect.any(String),
    analyzedIn: expect.any(Number),
    packages: expect.any(Array),
  });
});
