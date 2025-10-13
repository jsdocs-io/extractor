import { Effect } from "effect";
import { expect, test } from "vitest";
import { packageName } from "./package-name.ts";

const _packageName = (pkg: string) => Effect.runPromise(packageName(pkg));

test("no name", async () => {
	await expect(_packageName("")).rejects.toThrow();
});

test("whitespace", async () => {
	await expect(_packageName(" ")).rejects.toThrow();
});

test("at signs", async () => {
	await expect(_packageName("@")).rejects.toThrow();
	await expect(_packageName("@@")).rejects.toThrow();
	await expect(_packageName("@@@")).rejects.toThrow();
});

test("no name with version", async () => {
	await expect(_packageName("@1.0.0")).rejects.toThrow();
});

test("invalid name", async () => {
	await expect(_packageName("!")).rejects.toThrow();
});

test("invalid name with version", async () => {
	await expect(_packageName("!@1.0.0")).rejects.toThrow();
});

test("bare package name", async () => {
	await expect(_packageName("foo")).resolves.toBe("foo");
});

test("bare package name with version", async () => {
	await expect(_packageName("foo@1.0.0")).resolves.toBe("foo");
});

test("bare package name with range", async () => {
	await expect(_packageName("foo@^1")).resolves.toBe("foo");
});

test("bare package name with tag", async () => {
	await expect(_packageName("foo@latest")).resolves.toBe("foo");
});

test("scoped package name", async () => {
	await expect(_packageName("@foo/bar")).resolves.toBe("@foo/bar");
});

test("scoped package name with version", async () => {
	await expect(_packageName("@foo/bar@1.0.0")).resolves.toBe("@foo/bar");
});

test("scoped package name with range", async () => {
	await expect(_packageName("@foo/bar@^1.0.0")).resolves.toBe("@foo/bar");
});

test("scoped package name with tag", async () => {
	await expect(_packageName("@foo/bar@latest")).resolves.toBe("@foo/bar");
});
