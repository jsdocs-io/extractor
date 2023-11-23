import { describe, it } from "vitest";
import { expectPackageAPIToMatchSnapshot } from "../helpers/expect-package-api-to-match-snapshot";

describe("ts-dedent", () => {
  const name = "ts-dedent";

  it("2.0.0", async () => {
    await expectPackageAPIToMatchSnapshot({ name, version: "2.0.0" });
  });
});
