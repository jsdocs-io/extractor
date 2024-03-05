import { expect, test } from "vitest";
import { extractPackageApi } from "../../src";

test("verify-hcaptcha@1.0.0", async () => {
  expect(
    await extractPackageApi({
      pkg: "verify-hcaptcha@1.0.0",
    }),
  ).toMatchSnapshot({
    analyzedAt: expect.any(String),
    analyzedIn: expect.any(Number),
    packages: expect.any(Array),
  });
});
