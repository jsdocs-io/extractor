import { expect, test } from "vitest";
import { extractPackageApi } from "../../src";

test("preact@10.19.4", async () => {
  expect(
    (
      await extractPackageApi({
        pkg: "preact@10.19.4",
      })
    )._unsafeUnwrap(),
  ).toMatchSnapshot();
});

test("preact@10.19.4@hooks", async () => {
  expect(
    (
      await extractPackageApi({
        pkg: "preact@10.19.4",
        subpath: "hooks",
      })
    )._unsafeUnwrap(),
  ).toMatchSnapshot();
});
