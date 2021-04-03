import { extractPackageAPI } from '../../src/api-extractor/extract-package-api';
import { PackageAPI } from '../../src/types/package-api';
import { getTestFileSystem } from '../helpers/get-test-file-system';

describe('export-named-declaration-without-jsdoc', () => {
    let api: PackageAPI;

    beforeAll(() => {
        const name = 'export-named-declaration-without-jsdoc';
        const fileSystem = getTestFileSystem({ name });
        api = extractPackageAPI({
            fileSystem,
            entryPoint: 'index.ts',
        });
    });

    it('snapshot', () => {
        expect(api).toMatchSnapshot();
    });
});
