import fastGlob from "fast-glob";
import * as fs from "fs-extra";
import * as path from "path";
import * as tsm from "ts-morph";

export function getTestFileSystem({
  name,
}: {
  name: string;
}): tsm.FileSystemHost {
  const testData = path.join(__dirname, "../../test-data/api-extractor");
  const dir = path.join(testData, name);
  const filepaths = fastGlob.sync("**", { absolute: true, cwd: dir });
  const fileSystem = new tsm.InMemoryFileSystemHost();

  for (const filepath of filepaths) {
    const filename = path.relative(dir, filepath).replace(/\\/g, "/");
    const contents = fs.readFileSync(filepath, "utf-8");
    fileSystem.writeFileSync(filename, contents);
  }

  return fileSystem;
}
