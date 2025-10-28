import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("exome@2.4.0", async () => {
	expect(
		await getPackageApi({
			pkg: "exome@2.4.0",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});

test("exome@2.4.0@ghost", async () => {
	expect(
		await getPackageApi({
			pkg: "exome@2.4.0",
			subpath: "ghost",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
