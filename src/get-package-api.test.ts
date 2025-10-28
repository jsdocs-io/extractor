import { goTry } from "go-go-try";
import { join } from "pathe";
import { expect, test } from "vitest";
import { getPackageApi } from "./get-package-api.ts";

test("invalid package name", async () => {
	const [err, _] = await goTry(getPackageApi({ pkg: "" }));
	expect(err).toBeDefined();
});

test("invalid package name and empty subpath", async () => {
	const [err, _] = await goTry(getPackageApi({ pkg: "", subpath: "" }));
	expect(err).toBeDefined();
});

test("npm package not found", async () => {
	const [err, _] = await goTry(getPackageApi({ pkg: "@jsdocs-io/not-found" }));
	expect(err).toBeDefined();
});

test("npm package types not found", async () => {
	const [err, api] = await goTry(getPackageApi({ pkg: "unlicensed@0.4.0" }));
	expect(err).toBeUndefined();
	expect(api?.types).toBeUndefined();
});

test("npm package successfully analyzed", async () => {
	const [err, api] = await goTry(getPackageApi({ pkg: "short-time-ago@2.0.0" }));
	expect(err).toBeUndefined();
	expect(api).toMatchObject({ name: "short-time-ago", version: "2.0.0" });
});

test("local tarball package successfully analyzed", async () => {
	const [err, api] = await goTry(
		getPackageApi({ pkg: join(process.cwd(), "tarballs/short-time-ago-3.0.0.tgz") }),
	);
	expect(err).toBeUndefined();
	expect(api).toMatchObject({ name: "short-time-ago", version: "3.0.0" });
});
