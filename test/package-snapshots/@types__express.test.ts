import { describe, it } from "vitest";
import { expectPackageAPIToMatchSnapshot } from "../helpers/expect-package-api-to-match-snapshot";

describe("@types/express", () => {
  const name = "@types/express";

  it("4.17.11", async () => {
    await expectPackageAPIToMatchSnapshot({ name, version: "4.17.11" });
  });
});
