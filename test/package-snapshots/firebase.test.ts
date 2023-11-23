import { describe, it } from "vitest";
import { expectPackageAPIToMatchSnapshot } from "../helpers/expect-package-api-to-match-snapshot";

describe("firebase", () => {
  const name = "firebase";

  it("8.2.4", async () => {
    await expectPackageAPIToMatchSnapshot({ name, version: "8.2.4" });
  });
});
