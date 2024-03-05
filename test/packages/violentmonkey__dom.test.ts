import { expect, test } from "vitest";
import { extractPackageApi } from "../../src";

test("@violentmonkey/dom@2.1.5", async () => {
	expect(
		await extractPackageApi({
			pkg: "@violentmonkey/dom@2.1.5",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		packages: expect.any(Array),
	});
});
