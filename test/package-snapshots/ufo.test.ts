import { describe, it } from 'vitest';
import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('ufo', () => {
    const name = 'ufo';

    it('0.5.4', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '0.5.4' });
    });
});
