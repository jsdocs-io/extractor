import { fromPartial } from "@total-typescript/shoehorn";
import { expect, test } from "vitest";
import { typeCheckerType } from "./type-checker-type.ts";

test("return `any` in case of errors", async () => {
	expect(
		typeCheckerType(
			fromPartial({
				getProject() {
					throw new Error();
				},
			}),
		),
	).toBe("any");
});
