import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('react', () => {
    const name = 'react';

    it('17.0.1', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '17.0.1' });
    });
});
