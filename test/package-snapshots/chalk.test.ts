import { describe, it } from "vitest";
import { expectPackageAPIToMatchSnapshot } from "../helpers/expect-package-api-to-match-snapshot";

describe("chalk", () => {
  const name = "chalk";

  it("4.1.0", async () => {
    await expectPackageAPIToMatchSnapshot({ name, version: "4.1.0" });
  });
});
