import { describe, it } from 'vitest';
import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('camelcase', () => {
    const name = 'camelcase';

    it('6.2.0', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '6.2.0' });
    });
});
