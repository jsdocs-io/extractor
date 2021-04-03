import * as tsm from 'ts-morph';
import { getEntryPoint } from '../../src/package-analyzer/get-entry-point';

describe('getEntryPoint', () => {
    it('returns undefined if no entry point is found', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        expect(getEntryPoint({ fileSystem })).toBeUndefined();
    });

    it('returns the `public-package-api.ts` entry point in the root directory', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        fileSystem.writeFileSync('public-package-api.ts', '');

        expect(getEntryPoint({ fileSystem })).toEqual('/public-package-api.ts');
    });

    it('returns the `public-package-api.ts` entry point in the `dist` directory', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        fileSystem.writeFileSync('dist/public-package-api.ts', '');

        expect(getEntryPoint({ fileSystem })).toEqual(
            '/dist/public-package-api.ts'
        );
    });

    it('ignores entry points in the `node_modules` directory', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        fileSystem.writeFileSync('node_modules/public-package-api.ts', '');

        expect(getEntryPoint({ fileSystem })).toBeUndefined();
    });

    it('returns the entry point in the outermost directory (1)', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        fileSystem.writeFileSync('public-package-api.ts', '');
        fileSystem.writeFileSync('dist/public-package-api.ts', '');
        fileSystem.writeFileSync('dist/other/public-package-api.ts', '');

        expect(getEntryPoint({ fileSystem })).toEqual('/public-package-api.ts');
    });

    it('returns the entry point in the outermost directory (2)', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        fileSystem.writeFileSync(
            'long-name-but-not-deep/public-package-api.ts',
            ''
        );
        fileSystem.writeFileSync('a/b/c/public-package-api.ts', '');

        expect(getEntryPoint({ fileSystem })).toEqual(
            '/long-name-but-not-deep/public-package-api.ts'
        );
    });

    it('returns the entry point in the first directory in alphabetical order (1)', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        // Write order matters
        fileSystem.writeFileSync('foo/public-package-api.ts', '');
        fileSystem.writeFileSync('bar/public-package-api.ts', '');

        expect(getEntryPoint({ fileSystem })).toEqual(
            '/bar/public-package-api.ts'
        );
    });

    it('returns the entry point in the first directory in alphabetical order (2)', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        // Write order matters
        fileSystem.writeFileSync('bar/public-package-api.ts', '');
        fileSystem.writeFileSync('foo/public-package-api.ts', '');

        expect(getEntryPoint({ fileSystem })).toEqual(
            '/bar/public-package-api.ts'
        );
    });

    it('returns the entry point for the `source` property', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        fileSystem.writeFileSync('src/foo.ts', '');

        expect(getEntryPoint({ fileSystem, source: 'foo.ts' })).toEqual(
            '/src/foo.ts'
        );
        expect(getEntryPoint({ fileSystem, source: 'src/foo.ts' })).toEqual(
            '/src/foo.ts'
        );
        expect(getEntryPoint({ fileSystem, source: './src/foo.ts' })).toEqual(
            '/src/foo.ts'
        );
        expect(getEntryPoint({ fileSystem, source: '/src/foo.ts' })).toEqual(
            '/src/foo.ts'
        );
    });

    it('returns the entry point for the `name.ts` property (1)', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        fileSystem.writeFileSync('src/foo.ts', '');

        expect(getEntryPoint({ fileSystem, name: 'foo' })).toEqual(
            '/src/foo.ts'
        );
        expect(getEntryPoint({ fileSystem, name: 'foo.js' })).toEqual(
            '/src/foo.ts'
        );
        expect(getEntryPoint({ fileSystem, name: 'foo.ts' })).toEqual(
            '/src/foo.ts'
        );
        expect(getEntryPoint({ fileSystem, name: 'foo.d.ts' })).toEqual(
            '/src/foo.ts'
        );
    });

    it('returns the entry point for the `name.ts` property (2)', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        fileSystem.writeFileSync('src/foo__bar.ts', '');

        expect(getEntryPoint({ fileSystem, name: '@foo/bar' })).toEqual(
            '/src/foo__bar.ts'
        );
    });

    it('returns the `index.ts` entry point if `source` is specified but a corresponding entry point is not available', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        fileSystem.writeFileSync('index.ts', '');

        expect(getEntryPoint({ fileSystem, source: 'src/foo.ts' })).toEqual(
            '/index.ts'
        );
    });

    it('returns the `index.ts` entry point if `source` is invalid', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        fileSystem.writeFileSync('index.ts', '');

        expect(
            getEntryPoint({ fileSystem, source: 'src/foo.invalid.extension' })
        ).toEqual('/index.ts');
    });

    it('returns the `index.ts` entry point if `name` is specified but a corresponding entry point is not available', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        fileSystem.writeFileSync('index.ts', '');

        expect(getEntryPoint({ fileSystem, name: 'foo' })).toEqual('/index.ts');
    });

    it('returns the `public-package-api.d.ts` entry point in the root directory', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        fileSystem.writeFileSync('public-package-api.d.ts', '');

        expect(getEntryPoint({ fileSystem })).toEqual(
            '/public-package-api.d.ts'
        );
    });

    it('returns the `public-package-api.d.ts` entry point in the `dist` directory', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        fileSystem.writeFileSync('dist/public-package-api.d.ts', '');

        expect(getEntryPoint({ fileSystem })).toEqual(
            '/dist/public-package-api.d.ts'
        );
    });

    it('returns the entry point for the `types` or `typings` properties', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        fileSystem.writeFileSync('dist/foo.d.ts', '');

        // Types
        expect(getEntryPoint({ fileSystem, types: 'foo.d.ts' })).toEqual(
            '/dist/foo.d.ts'
        );
        expect(getEntryPoint({ fileSystem, types: 'dist/foo.d.ts' })).toEqual(
            '/dist/foo.d.ts'
        );
        expect(getEntryPoint({ fileSystem, types: './dist/foo.d.ts' })).toEqual(
            '/dist/foo.d.ts'
        );
        expect(getEntryPoint({ fileSystem, types: '/dist/foo.d.ts' })).toEqual(
            '/dist/foo.d.ts'
        );

        // Typings
        expect(getEntryPoint({ fileSystem, typings: 'foo.d.ts' })).toEqual(
            '/dist/foo.d.ts'
        );
        expect(getEntryPoint({ fileSystem, typings: 'dist/foo.d.ts' })).toEqual(
            '/dist/foo.d.ts'
        );
        expect(
            getEntryPoint({ fileSystem, typings: './dist/foo.d.ts' })
        ).toEqual('/dist/foo.d.ts');
        expect(
            getEntryPoint({ fileSystem, typings: '/dist/foo.d.ts' })
        ).toEqual('/dist/foo.d.ts');
    });

    it('returns the entry point for the `name.d.ts` property (1)', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        fileSystem.writeFileSync('dist/foo.d.ts', '');

        expect(getEntryPoint({ fileSystem, name: 'foo' })).toEqual(
            '/dist/foo.d.ts'
        );
        expect(getEntryPoint({ fileSystem, name: 'foo.js' })).toEqual(
            '/dist/foo.d.ts'
        );
        expect(getEntryPoint({ fileSystem, name: 'foo.ts' })).toEqual(
            '/dist/foo.d.ts'
        );
        expect(getEntryPoint({ fileSystem, name: 'foo.d.ts' })).toEqual(
            '/dist/foo.d.ts'
        );
    });

    it('returns the entry point for the `name.d.ts` property (2)', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        fileSystem.writeFileSync('dist/foo__bar.d.ts', '');

        expect(getEntryPoint({ fileSystem, name: '@foo/bar' })).toEqual(
            '/dist/foo__bar.d.ts'
        );
    });

    it('returns the `index.d.ts` entry point if `types` are specified but a corresponding entry point is not available', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        fileSystem.writeFileSync('index.d.ts', '');

        expect(getEntryPoint({ fileSystem, types: 'dist/foo.d.ts' })).toEqual(
            '/index.d.ts'
        );
    });

    it('returns the `index.d.ts` entry point if `types` is invalid', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        fileSystem.writeFileSync('index.d.ts', '');

        expect(
            getEntryPoint({ fileSystem, types: 'dist/foo.invalid.extension' })
        ).toEqual('/index.d.ts');
    });

    it('returns the `index.d.ts` entry point if `name` is specified but a corresponding entry point is not available', () => {
        const fileSystem = new tsm.InMemoryFileSystemHost();

        fileSystem.writeFileSync('index.d.ts', '');

        expect(getEntryPoint({ fileSystem, name: 'foo' })).toEqual(
            '/index.d.ts'
        );
    });
});
