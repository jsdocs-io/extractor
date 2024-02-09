import { expect, test } from "vitest";
import { extractPackageApi } from "../../src";

test("magicast@0.3.3", async () => {
  expect(
    (
      await extractPackageApi({
        pkg: "magicast@0.3.3",
      })
    )._unsafeUnwrap(),
  ).toMatchSnapshot({
    analyzedAt: expect.any(String),
    analyzedIn: expect.any(Number),
    packages: expect.any(Array),
  });
});
