import { describe, it } from "vitest";
import { expectPackageAPIToMatchSnapshot } from "../helpers/expect-package-api-to-match-snapshot";

describe("vue", () => {
  const name = "vue";

  it("2.6.12", async () => {
    await expectPackageAPIToMatchSnapshot({ name, version: "2.6.12" });
  });
});
