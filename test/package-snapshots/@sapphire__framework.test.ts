import { describe, it } from "vitest";
import { expectPackageAPIToMatchSnapshot } from "../helpers/expect-package-api-to-match-snapshot";

describe("@sapphire/framework", () => {
  const name = "@sapphire/framework";

  it("1.0.0-alpha.3", async () => {
    await expectPackageAPIToMatchSnapshot({
      name,
      version: "1.0.0-alpha.3",
    });
  });
});
