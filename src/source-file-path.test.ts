import { fromPartial } from "@total-typescript/shoehorn";
import { expect, test } from "vitest";
import { sourceFilePath } from "./source-file-path.ts";

test("empty path", () => {
	expect(
		sourceFilePath(
			fromPartial({
				getSourceFile() {
					return {
						getFilePath() {
							return "";
						},
					};
				},
			}),
		),
	).toBe("");
});

test("only filename", () => {
	expect(
		sourceFilePath(
			fromPartial({
				getSourceFile() {
					return {
						getFilePath() {
							return "index.ts";
						},
					};
				},
			}),
		),
	).toBe("index.ts");
});

test("dir and filename", () => {
	expect(
		sourceFilePath(
			fromPartial({
				getSourceFile() {
					return {
						getFilePath() {
							return "/src/index.ts";
						},
					};
				},
			}),
		),
	).toBe("/src/index.ts");
});

test("node_modules, dir and filename", () => {
	expect(
		sourceFilePath(
			fromPartial({
				getSourceFile() {
					return {
						getFilePath() {
							return "/node_modules/src/index.ts";
						},
					};
				},
			}),
		),
	).toBe("/src/index.ts");
});

test("temp dir, node_modules, package dir and filename", () => {
	expect(
		sourceFilePath(
			fromPartial({
				getSourceFile() {
					return {
						getFilePath() {
							return "/tmp/some_unique_dir/node_modules/my-package/src/index.ts";
						},
					};
				},
			}),
		),
	).toBe("/my-package/src/index.ts");
});

test("temp dir, node_modules, scoped package dir and filename", () => {
	expect(
		sourceFilePath(
			fromPartial({
				getSourceFile() {
					return {
						getFilePath() {
							return "/tmp/some_unique_dir/node_modules/@my-scope/my-package/src/index.ts";
						},
					};
				},
			}),
		),
	).toBe("/@my-scope/my-package/src/index.ts");
});
