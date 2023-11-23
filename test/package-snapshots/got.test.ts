import { describe, it } from "vitest";
import { expectPackageAPIToMatchSnapshot } from "../helpers/expect-package-api-to-match-snapshot";

describe("got", () => {
  const name = "got";

  it("11.8.1", async () => {
    await expectPackageAPIToMatchSnapshot({ name, version: "11.8.1" });
  });
});
