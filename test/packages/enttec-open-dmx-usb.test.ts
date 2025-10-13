import { expect, test } from "vitest";
import { extractPackageApi } from "../../src/extract-package-api.ts";

test("enttec-open-dmx-usb@4.0.1", async () => {
	expect(
		await extractPackageApi({
			pkg: "enttec-open-dmx-usb@4.0.1",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		packages: expect.any(Array),
	});
});
