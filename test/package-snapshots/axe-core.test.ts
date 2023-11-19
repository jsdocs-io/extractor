import { describe, it } from 'vitest';
import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('axe-core', () => {
    const name = 'axe-core';

    it('4.1.1', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '4.1.1' });
    });
});
