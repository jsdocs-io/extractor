import { describe, it } from "vitest";
import { expectPackageAPIToMatchSnapshot } from "../helpers/expect-package-api-to-match-snapshot";

describe("bundle-require", () => {
  const name = "bundle-require";

  it("2.1.2", async () => {
    await expectPackageAPIToMatchSnapshot({ name, version: "2.1.2" });
  });
});
