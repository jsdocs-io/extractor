import { goTry } from "go-go-try";
import { expect, test } from "vitest";
import { Bun } from "./bun.ts";
import { tempDir } from "./temp-dir.ts";

test("optional bunCmd in constructor", () => {
	const bun = new Bun();
	expect(bun).toBeDefined();
});

test("custom bunCmd in constructor", () => {
	const bun = new Bun("bun");
	expect(bun).toBeDefined();
});

test("empty pkg", async () => {
	await using dir = await tempDir();
	const bun = new Bun();
	const [err, deps] = await goTry(bun.add("", dir.path));
	expect(err).toBeDefined();
	expect(deps).toBeUndefined();
});

test("package with no dependencies", async () => {
	await using dir = await tempDir();
	const bun = new Bun();
	const [err, deps] = await goTry(bun.add("verify-hcaptcha@1.0.0", dir.path));
	expect(err).toBeUndefined();
	expect(deps).toMatchInlineSnapshot(`
		[
		  "verify-hcaptcha@1.0.0",
		]
	`);
});

test("package with some dependencies", async () => {
	await using dir = await tempDir();
	const bun = new Bun();
	const [err, deps] = await goTry(bun.add("query-registry@4.2.0", dir.path));
	expect(err).toBeUndefined();
	expect(deps).toBeDefined();
	expect(deps).toContain("query-registry@4.2.0");
	expect(deps!.length).toBeGreaterThan(1);
});
