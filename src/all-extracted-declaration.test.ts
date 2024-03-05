import { expect, test } from "vitest";
import * as allExtractedDeclaration from "./all-extracted-declaration";

test("ok", () => {
	const declaration: allExtractedDeclaration.AllExtractedDeclaration = {
		kind: "variable",
		id: "",
		name: "",
		docs: [],
		file: "",
		line: 0,
		signature: "",
	};
	expect(declaration.kind).toBe("variable");
});
