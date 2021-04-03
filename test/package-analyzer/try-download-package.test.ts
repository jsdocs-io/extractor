import nock from 'nock';
import * as path from 'path';
import { tryDownloadPackage } from '../../src/package-analyzer/try-download-package';

const host = 'https://example.com';
const tarball = `${host}/tarball.tar.gz`;

const invalidTarballFile = path.join(
    __dirname,
    '../../test-data/tarballs/invalid.tar.gz'
);

const validTarballFile = path.join(
    __dirname,
    '../../test-data/tarballs/valid.tar.gz'
);

describe('tryDownloadPackage', () => {
    afterEach(async () => {
        nock.cleanAll();
    });

    afterAll(() => {
        nock.restore();
    });

    it('returns undefined when the download fails', async () => {
        expect.assertions(1);

        nock(host)
            .get(() => true)
            .reply(404);

        expect(await tryDownloadPackage({ tarball })).toBeUndefined();
    });

    it('returns undefined when the tarball extraction fails', async () => {
        expect.assertions(1);

        nock(host)
            .get(() => true)
            .replyWithFile(200, invalidTarballFile);

        expect(await tryDownloadPackage({ tarball })).toBeUndefined();
    });

    it('returns a file system with package contents when the download succeeds', async () => {
        expect.assertions(3);

        nock(host)
            .get(() => true)
            .replyWithFile(200, validTarballFile);

        const fs = await tryDownloadPackage({ tarball });

        expect(fs).toBeDefined();
        expect(fs?.fileExistsSync('/index.ts')).toBeTruthy();
        expect(fs?.readFileSync('/index.ts')).toEqual(
            'export const foo = 42;\n'
        );
    });
});
