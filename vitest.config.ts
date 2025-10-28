import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		pool: "vmThreads",
		testTimeout: 60_000, // Analyzing npm packages takes time.
		coverage: { include: ["src/**"] },
	},
});
