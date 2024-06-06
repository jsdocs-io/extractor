import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		// Prevent vitest from hanging when tests are done.
		// See https://github.com/vitest-dev/vitest/issues/4526#issuecomment-1817817409.
		pool: "forks",

		// Package analysis tests require a lot of time.
		testTimeout: 60000,

		coverage: {
			include: ["src/**"],
		},
	},
});
