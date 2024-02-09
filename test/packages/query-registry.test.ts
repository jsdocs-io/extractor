import { expect, test } from "vitest";
import { extractPackageApi } from "../../src";

test("query-registry@2.6.0", async () => {
  expect(
    (
      await extractPackageApi({
        pkg: "query-registry@2.6.0",
      })
    )._unsafeUnwrap(),
  ).toMatchSnapshot();
});