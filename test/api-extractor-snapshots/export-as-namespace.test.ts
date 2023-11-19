import { beforeAll, describe, expect, it } from 'vitest';
import { extractPackageAPI } from '../../src/api-extractor/extract-package-api';
import { PackageAPI } from '../../src/types/package-api';
import { getTestFileSystem } from '../helpers/get-test-file-system';

describe('export-as-namespace', () => {
    let api: PackageAPI;

    beforeAll(() => {
        const name = 'export-as-namespace';
        const fileSystem = getTestFileSystem({ name });
        api = extractPackageAPI({ fileSystem, entryPoint: 'index.d.ts' });
    });

    it('snapshot', () => {
        expect(api).toMatchSnapshot();
    });
});
