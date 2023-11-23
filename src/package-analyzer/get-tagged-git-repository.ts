import { GitRepository } from "query-registry";
import { TaggedGitRepository } from "../types/tagged-git-repository";

export function getTaggedGitRepository({
  id,
  gitRepository,
  gitHead,
  version,
}: {
  id: string;
  gitRepository?: GitRepository;
  gitHead?: string;
  version: string;
}): TaggedGitRepository | undefined {
  if (!gitRepository) {
    return undefined;
  }

  const { url, directory: dir } = gitRepository;

  if (isDefinitelyTypedPackage({ id })) {
    return { url, dir };
  }

  const tag = gitHead ?? `v${version}`;
  return { url, tag, dir };
}

function isDefinitelyTypedPackage({ id }: { id: string }): boolean {
  return id.startsWith("@types/");
}
