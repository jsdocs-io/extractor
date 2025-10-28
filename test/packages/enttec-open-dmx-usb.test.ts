import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("enttec-open-dmx-usb@4.0.1", async () => {
	expect(
		await getPackageApi({
			pkg: "enttec-open-dmx-usb@4.0.1",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
