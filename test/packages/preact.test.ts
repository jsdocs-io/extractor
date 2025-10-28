import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("preact@10.19.4", async () => {
	expect(
		await getPackageApi({
			pkg: "preact@10.19.4",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});

test("preact@10.19.4@hooks", async () => {
	expect(
		await getPackageApi({
			pkg: "preact@10.19.4",
			subpath: "hooks",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
