import { describe, it } from 'vitest';
import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('freebox', () => {
    const name = 'freebox';

    it('1.3.3', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '1.3.3' });
    });
});
