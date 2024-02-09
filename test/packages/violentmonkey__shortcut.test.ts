import { expect, test } from "vitest";
import { extractPackageApi } from "../../src";

test("@violentmonkey/shortcut@1.4.1", async () => {
  expect(
    (
      await extractPackageApi({
        pkg: "@violentmonkey/shortcut@1.4.1",
      })
    )._unsafeUnwrap(),
  ).toMatchSnapshot();
});
