import { expect, test } from "vitest";
import { extractPackageApi } from "../../src";

test("exome@2.4.0", async () => {
  expect(
    (
      await extractPackageApi({
        pkg: "exome@2.4.0",
      })
    )._unsafeUnwrap(),
  ).toMatchSnapshot();
});

test("exome@2.4.0@ghost", async () => {
  expect(
    (
      await extractPackageApi({
        pkg: "exome@2.4.0",
        subpath: "ghost",
      })
    )._unsafeUnwrap(),
  ).toMatchSnapshot();
});
