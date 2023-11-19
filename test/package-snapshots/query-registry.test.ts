import { describe, it } from 'vitest';
import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('query-registry', () => {
    const name = 'query-registry';

    it('2.0.0-0', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '2.0.0-0' });
    });

    it('1.2.0', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '1.2.0' });
    });
});
