import HostedGitInfo from "hosted-git-info";
import * as path from "path";
import { TaggedGitRepository } from "../types/tagged-git-repository";
import { toForwardSlashes } from "../utils/to-forward-slashes";

export type RepositoryFileURLProvider = ({
  filename,
  line,
}: {
  filename: string;
  line?: number;
}) => string | undefined;

export function getRepositoryFileURLProvider({
  repository,
}: {
  repository?: TaggedGitRepository;
}): RepositoryFileURLProvider {
  if (!repository) {
    return () => undefined;
  }

  const { url, tag = "", dir = "" } = repository;
  const info = HostedGitInfo.fromUrl(url, { noGitPlus: true });
  if (!info) {
    return () => undefined;
  }

  const linePrefix = getLinePrefix({ info });

  return ({ filename, line }) => {
    const filepath = toForwardSlashes(path.join(dir, filename));
    const fileURL = info.browse(filepath, { committish: tag });
    const lineFragment = line ? `${linePrefix}${line}` : "";
    return `${fileURL}${lineFragment}`;
  };
}

function getLinePrefix({ info }: { info: HostedGitInfo }): string {
  const { type: provider } = info;
  switch (provider) {
    case "bitbucket":
      return "#lines-";
    default:
      return "#L";
  }
}
