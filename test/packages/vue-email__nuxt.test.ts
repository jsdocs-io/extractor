import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("@vue-email/nuxt@0.8.13", async () => {
	expect(
		await getPackageApi({
			pkg: "@vue-email/nuxt@0.8.13",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
