import { describe, expect, it } from 'vitest';
import { getUnpkgFileURLProvider } from '../../src/api-extractor/unpkg-file-url-provider';

describe('getUnpkgFileURL', () => {
    it('returns undefined if the package ID is undefined', () => {
        const getUnpkgFileURL = getUnpkgFileURLProvider({
            id: undefined,
        });
        expect(getUnpkgFileURL({ filename: '' })).toBeUndefined();
    });

    it('returns a URL if the package ID is provided', () => {
        const getUnpkgFileURL = getUnpkgFileURLProvider({
            id: 'foo@1.0.0',
        });

        expect(
            getUnpkgFileURL({
                filename: 'bar.ts',
            })
        ).toEqual('https://unpkg.com/browse/foo@1.0.0/bar.ts');

        expect(
            getUnpkgFileURL({
                filename: 'bar.ts',
                line: 99,
            })
        ).toEqual('https://unpkg.com/browse/foo@1.0.0/bar.ts#L99');
    });
});
