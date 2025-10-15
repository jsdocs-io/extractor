import { expect, test } from "vitest";
import * as all from "./index.ts";

test("index.ts exports", () => {
	expect(all).toBeDefined();
});
