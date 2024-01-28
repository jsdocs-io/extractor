import { npmRegistry, npmRegistryMirrors } from "query-registry";
import { expect } from "vitest";
// import { analyzeRegistryPackage } from "../../src";

const verdaccioRegistry = "http://localhost:4873";

export async function expectPackageAPIToMatchSnapshot({
  name,
  version,
}: {
  name: string;
  version: string;
}) {
  expect.assertions(1);

  const { api } = await analyzeRegistryPackage({
    name,
    version,
    registry: verdaccioRegistry,
    mirrors: [npmRegistry, ...npmRegistryMirrors],
  });
  expect(api).toMatchSnapshot();
}

function analyzeRegistryPackage(arg0: {
  name: string;
  version: string;
  registry: string;
  mirrors: string[];
}): { api: any } | PromiseLike<{ api: any }> {
  throw new Error("Function not implemented.");
}
