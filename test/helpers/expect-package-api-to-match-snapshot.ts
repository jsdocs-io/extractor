import { npmRegistry, npmRegistryMirrors } from 'query-registry';
import { analyzeRegistryPackage } from '../../src';

const verdaccioRegistry = 'http://localhost:4873';

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
