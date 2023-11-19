import { describe, it } from 'vitest';
import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('short-time-ago', () => {
    const name = 'short-time-ago';

    it('2.0.0', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '2.0.0' });
    });
});
