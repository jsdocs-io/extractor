import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("query-registry@2.6.0", async () => {
	expect(
		await getPackageApi({
			pkg: "query-registry@2.6.0",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});

test("query-registry@3.0.0", async () => {
	expect(
		await getPackageApi({
			pkg: "query-registry@3.0.0",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
