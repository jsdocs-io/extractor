import { expect, test } from "vitest";
import { extractPackageApi } from "../../src";

test("twoslash@0.2.1", async () => {
  expect(
    await extractPackageApi({
      pkg: "twoslash@0.2.1",
    }),
  ).toMatchSnapshot({
    analyzedAt: expect.any(String),
    analyzedIn: expect.any(Number),
    packages: expect.any(Array),
  });
});
