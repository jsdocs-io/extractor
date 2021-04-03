import { getTaggedGitRepository } from '../../src/package-analyzer/get-tagged-git-repository';

describe('getTaggedGitRepository', () => {
    it('returns undefined if the registry repository is undefined', () => {
        expect(
            getTaggedGitRepository({ id: 'foo', version: '1.0.0' })
        ).toBeUndefined();
    });

    it('returns a repository for Definitely Typed packages', () => {
        expect(
            getTaggedGitRepository({
                id: '@types/foo',
                version: '1.0.0',
                gitRepository: {
                    type: 'git',
                    url: 'https://github.com/DefinitelyTyped/DefinitelyTyped',
                    directory: 'types/foo',
                },
            })
        ).toStrictEqual({
            url: 'https://github.com/DefinitelyTyped/DefinitelyTyped',
            dir: 'types/foo',
        });
    });

    it('returns a repository for normal packages using `gitHead` if available', () => {
        expect(
            getTaggedGitRepository({
                id: 'foo',
                version: '1.0.0',
                gitHead: 'some-commit-hash',
                gitRepository: {
                    type: 'git',
                    url: 'https://github.com/user/repo',
                },
            })
        ).toStrictEqual({
            url: 'https://github.com/user/repo',
            tag: 'some-commit-hash',
            dir: undefined,
        });
    });

    it('returns a repository for normal packages using the package version if `gitHead` is not available', () => {
        expect(
            getTaggedGitRepository({
                id: 'foo',
                version: '1.0.0',
                gitRepository: {
                    type: 'git',
                    url: 'https://github.com/user/repo',
                },
            })
        ).toStrictEqual({
            url: 'https://github.com/user/repo',
            tag: 'v1.0.0',
            dir: undefined,
        });
    });
});
