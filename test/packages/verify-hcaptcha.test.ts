import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("verify-hcaptcha@1.0.0", async () => {
	expect(
		await getPackageApi({
			pkg: "verify-hcaptcha@1.0.0",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
