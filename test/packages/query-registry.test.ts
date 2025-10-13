import { expect, test } from "vitest";
import { extractPackageApi } from "../../src/extract-package-api.ts";

test("query-registry@2.6.0", async () => {
	expect(
		await extractPackageApi({
			pkg: "query-registry@2.6.0",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		packages: expect.any(Array),
	});
});

test("query-registry@3.0.0", async () => {
	expect(
		await extractPackageApi({
			pkg: "query-registry@3.0.0",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		packages: expect.any(Array),
	});
});
