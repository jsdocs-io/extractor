import { describe, it } from 'vitest';
import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('fp-ts', () => {
    const name = 'fp-ts';

    it('2.9.3', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '2.9.3' });
    });
});
