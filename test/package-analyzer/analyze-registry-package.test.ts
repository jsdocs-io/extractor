/** @jest-environment setup-polly-jest/jest-environment-node */
// See https://netflix.github.io/pollyjs/#/test-frameworks/jest-jasmine?id=supported-test-runners

import NodeHttpAdapter from '@pollyjs/adapter-node-http';
import FSPersister from '@pollyjs/persister-fs';
import * as path from 'path';
import { setupPolly } from 'setup-polly-jest';
import { mocked } from 'ts-jest/utils';
import * as tsm from 'ts-morph';
import { analyzeRegistryPackage } from '../../src';
import { extractPackageAPI } from '../../src/api-extractor/extract-package-api';
import { tryDownloadPackage } from '../../src/package-analyzer/try-download-package';

jest.mock('../../src/package-analyzer/try-download-package', () => ({
    tryDownloadPackage: jest.fn(),
}));

jest.mock('../../src/api-extractor/extract-package-api', () => ({
    extractPackageAPI: jest.fn(),
}));

const mockedTryDownloadPackage = mocked(tryDownloadPackage, true);
const mockedExtractPackageAPI = mocked(extractPackageAPI, true);

// See https://github.com/gribnoysup/setup-polly-jest/issues/23#issuecomment-890494186
// Polly.register(NodeHttpAdapter);
// Polly.register(FSPersister);

describe('analyzeRegistryPackage', () => {
    setupPolly({
        adapters: [NodeHttpAdapter],
        persister: FSPersister,
        persisterOptions: {
            fs: {
                recordingsDir: path.resolve(__dirname, '../../__recordings__'),
            },
        },
        recordFailedRequests: true,
    });

    it('throws if the package name is not valid', async () => {
        expect.assertions(1);

        try {
            await analyzeRegistryPackage({ name: '' });
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    it('throws if the package version is not valid', async () => {
        expect.assertions(1);

        try {
            await analyzeRegistryPackage({
                name: 'short-time-ago',
                version: 'invalid',
            });
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    it('does not extract the API if the license is invalid', async () => {
        expect.assertions(1);

        const { api } = await analyzeRegistryPackage({
            name: 'unlicensed',
            version: '0.4.0',
        });

        expect(api).toBeUndefined();
    });

    it('does not extract the API if type definitions are not present', async () => {
        expect.assertions(1);

        const { api } = await analyzeRegistryPackage({
            name: 'workerpool',
            version: '6.0.0',
        });

        expect(api).toBeUndefined();
    });

    it('does not extract the API if the package download fails', async () => {
        expect.assertions(1);

        mockedTryDownloadPackage.mockImplementation(async () => {
            return undefined;
        });

        const { api } = await analyzeRegistryPackage({
            name: 'short-time-ago',
            version: '2.0.0',
        });

        expect(api).toBeUndefined();
    });

    it('does not extract the API if the API extraction fails', async () => {
        expect.assertions(1);

        mockedTryDownloadPackage.mockImplementation(async () => {
            const fileSystem = new tsm.InMemoryFileSystemHost();
            fileSystem.writeFileSync('index.ts', '');
            return fileSystem;
        });

        mockedExtractPackageAPI.mockImplementation(() => {
            throw new Error('failed');
        });

        const { api } = await analyzeRegistryPackage({
            name: 'short-time-ago',
            version: '2.0.0',
        });

        expect(api).toBeUndefined();
    });

    it('skips API extraction if required', async () => {
        expect.assertions(1);

        const { api } = await analyzeRegistryPackage({
            name: 'short-time-ago',
            version: '2.0.0',
            skipAPIExtraction: true,
        });

        expect(api).toBeUndefined();
    });

    it('extracts the API from a registry package', async () => {
        expect.assertions(1);

        mockedTryDownloadPackage.mockImplementation(async () => {
            const fileSystem = new tsm.InMemoryFileSystemHost();
            fileSystem.writeFileSync('index.ts', '');
            return fileSystem;
        });

        const wantedAPI = {
            overview: '/** Overview */',
            declarations: {
                variables: [],
                functions: [],
                classes: [],
                interfaces: [],
                enums: [],
                typeAliases: [],
                namespaces: [],
            },
            files: [],
        };
        mockedExtractPackageAPI.mockImplementation(() => {
            return wantedAPI;
        });

        const { api } = await analyzeRegistryPackage({
            name: 'short-time-ago',
            version: '2.0.0',
        });

        expect(api).toStrictEqual(wantedAPI);
    });
});
