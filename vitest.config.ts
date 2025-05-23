import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		pool: "threads",
		testTimeout: 60_000, // Analyzing npm packages takes time.
		coverage: { include: ["src/**"] },
	},
});
