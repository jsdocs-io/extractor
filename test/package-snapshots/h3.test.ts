import { describe, it } from "vitest";
import { expectPackageAPIToMatchSnapshot } from "../helpers/expect-package-api-to-match-snapshot";

describe("h3", () => {
  const name = "h3";

  it("0.3.3", async () => {
    await expectPackageAPIToMatchSnapshot({ name, version: "0.3.3" });
  });
});
