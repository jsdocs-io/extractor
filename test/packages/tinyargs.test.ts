import { expect, test } from "vitest";
import { extractPackageApi } from "../../src";

test("tinyargs@0.1.4", async () => {
  expect(
    (
      await extractPackageApi({
        pkg: "tinyargs@0.1.4",
      })
    )._unsafeUnwrap(),
  ).toMatchSnapshot({
    analyzedAt: expect.any(String),
    analyzedIn: expect.any(Number),
    packages: expect.any(Array),
  });
});
