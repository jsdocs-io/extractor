import { expect, test } from "vitest";
import { extractPackageApi } from "./extract-package-api";

test("invalid package name", async () => {
	const startDir = process.cwd();
	await expect(extractPackageApi({ pkg: "" })).rejects.toThrow();
	expect(process.cwd()).toBe(startDir);
});

test("package not found", async () => {
	const startDir = process.cwd();
	await expect(
		extractPackageApi({ pkg: "@jsdocs-io/not-found" }),
	).rejects.toThrow();
	expect(process.cwd()).toBe(startDir);
});

test("package types not found", async () => {
	const startDir = process.cwd();
	await expect(
		extractPackageApi({ pkg: "unlicensed@0.4.0" }),
	).rejects.toThrow();
	expect(process.cwd()).toBe(startDir);
});

test("package successfully analyzed", async () => {
	const startDir = process.cwd();
	await expect(
		extractPackageApi({ pkg: "short-time-ago@2.0.0" }),
	).resolves.toMatchObject({
		name: "short-time-ago",
		version: "2.0.0",
	});
	expect(process.cwd()).toBe(startDir);
});
