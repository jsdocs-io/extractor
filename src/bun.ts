import { execa } from "execa";

/** `Bun` is a wrapper for the Bun package manager. */
export class Bun {
	#bunCmd: string;

	constructor(bunCmd = "bun") {
		this.#bunCmd = bunCmd.trim();
	}

	/**
	`add` installs the given package in the given directory and
	returns a list of all installed packages (e.g., `["foo@1.0.0"]`).

	@see {@link https://bun.sh/docs/cli/add}
	*/
	async add(pkg: string, cwd: string): Promise<string[]> {
		// Run `bun add <pkg> --verbose` in the `cwd`.
		const { stdout } = await execa(this.#bunCmd, ["add", pkg, "--verbose"], { cwd });

		// With verbose output on, bun prints one line per installed package
		// (e.g., "foo@1.0.0"), including all installed dependencies.
		// These lines are between the two delimiting lines found here:
		// https://github.com/oven-sh/bun/blob/972a7b7080bd3066b54dcb43e9c91c5dfa26a69c/src/install/lockfile.zig#L5369-L5370.
		const lines = stdout.split("\n");
		const beginHash = lines.findIndex((line) => line.startsWith("-- BEGIN SHA512/256"));
		const endHash = lines.findIndex((line) => line.startsWith("-- END HASH"));
		const installedPackages = lines.slice(beginHash + 1, endHash);
		return installedPackages;
	}
}
