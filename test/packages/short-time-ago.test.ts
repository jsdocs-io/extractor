import { expect, test } from "vitest";
import { extractPackageApi } from "../../src";

test("short-time-ago@2.0.0", async () => {
  expect(
    await extractPackageApi({
      pkg: "short-time-ago@2.0.0",
    }),
  ).toMatchSnapshot({
    analyzedAt: expect.any(String),
    analyzedIn: expect.any(Number),
    packages: expect.any(Array),
  });
});
