import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("@violentmonkey/shortcut@1.4.1", async () => {
	expect(
		await getPackageApi({
			pkg: "@violentmonkey/shortcut@1.4.1",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
