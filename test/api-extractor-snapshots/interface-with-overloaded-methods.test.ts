import { extractPackageAPI } from '../../src/api-extractor/extract-package-api';
import { PackageAPI } from '../../src/types/package-api';
import { getTestFileSystem } from '../helpers/get-test-file-system';

describe('interface-with-overloaded-methods', () => {
    let api: PackageAPI;

    beforeAll(() => {
        const name = 'interface-with-overloaded-methods';
        const fileSystem = getTestFileSystem({ name });
        api = extractPackageAPI({ fileSystem, entryPoint: 'index.d.ts' });
    });

    it('snapshot', () => {
        expect(api).toMatchSnapshot();
    });
});
