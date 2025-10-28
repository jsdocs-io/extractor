import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("@violentmonkey/dom@2.1.5", async () => {
	expect(
		await getPackageApi({
			pkg: "@violentmonkey/dom@2.1.5",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
