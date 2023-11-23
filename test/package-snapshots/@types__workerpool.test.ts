import { describe, it } from "vitest";
import { expectPackageAPIToMatchSnapshot } from "../helpers/expect-package-api-to-match-snapshot";

describe("@types/workerpool", () => {
  const name = "@types/workerpool";

  it("6.0.0", async () => {
    await expectPackageAPIToMatchSnapshot({ name, version: "6.0.0" });
  });
});
