import { describe, expect, it } from "vitest";
import { getRepositoryFileURLProvider } from "../../src/api-extractor/repository-file-url-provider";

describe("getRepositoryFileURL", () => {
  it("returns undefined if the repository is undefined", () => {
    const getRepositoryFileURL = getRepositoryFileURLProvider({
      repository: undefined,
    });
    expect(getRepositoryFileURL({ filename: "" })).toBeUndefined();
  });

  it("returns undefined if the repository is not supported", () => {
    const getRepositoryFileURL = getRepositoryFileURLProvider({
      repository: { url: "" },
    });
    expect(getRepositoryFileURL({ filename: "" })).toBeUndefined();
  });

  it("returns a URL if the repository is supported (GitHub)", () => {
    const getRepositoryFileURL = getRepositoryFileURLProvider({
      repository: {
        url: "https://github.com/user/repo",
        tag: "v1.0.0",
      },
    });

    expect(
      getRepositoryFileURL({
        filename: "foo.ts",
      }),
    ).toEqual("https://github.com/user/repo/tree/v1.0.0/foo.ts");

    expect(
      getRepositoryFileURL({
        filename: "foo.ts",
        line: 99,
      }),
    ).toEqual("https://github.com/user/repo/tree/v1.0.0/foo.ts#L99");
  });

  it("returns a URL if the repository is supported (Bitbucket)", () => {
    const getRepositoryFileURL = getRepositoryFileURLProvider({
      repository: {
        url: "https://bitbucket.org/user/repo",
        tag: "v1.0.0",
      },
    });

    expect(
      getRepositoryFileURL({
        filename: "foo.ts",
        line: 99,
      }),
    ).toEqual("https://bitbucket.org/user/repo/src/v1.0.0/foo.ts#lines-99");
  });
});
