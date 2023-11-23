import got from "got";
import gunzipMaybe from "gunzip-maybe";
import stream from "stream";
import * as tsm from "ts-morph";
import { promisify } from "util";
import { log } from "../utils/log";
import { extractPackageTarball } from "./extract-package-tarball";

const pipeline = promisify(stream.pipeline);

export async function tryDownloadPackage({
  tarball,
}: {
  tarball: string;
}): Promise<tsm.FileSystemHost | undefined> {
  try {
    const fileSystem = new tsm.InMemoryFileSystemHost();

    await pipeline(
      got.stream(tarball),
      gunzipMaybe(),
      extractPackageTarball({ fileSystem }),
    );

    return fileSystem;
  } catch (err) {
    log("tryDownloadPackage: download failed: %O", { tarball, err });
    return undefined;
  }
}
