import { describe, it } from 'vitest';
import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('verify-hcaptcha', () => {
    const name = 'verify-hcaptcha';

    it('1.0.0', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '1.0.0' });
    });
});
