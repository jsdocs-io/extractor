import { getOptimizedFilePattern } from '../../src/package-analyzer/get-optimized-file-pattern';

describe('getOptimizedFilePattern', () => {
    it('returns undefined if `ignoreFilePatternOptimizations` is true', () => {
        expect(
            getOptimizedFilePattern({
                name: '',
                ignoreFilePatternOptimizations: true,
            })
        ).toBeUndefined();
    });
});
