import { expect, test } from "vitest";
import { extractPackageApi } from "../../src";

test("@vue-email/nuxt@0.8.13", async () => {
  expect(
    await extractPackageApi({
      pkg: "@vue-email/nuxt@0.8.13",
    }),
  ).toMatchSnapshot({
    analyzedAt: expect.any(String),
    analyzedIn: expect.any(Number),
    packages: expect.any(Array),
  });
});
