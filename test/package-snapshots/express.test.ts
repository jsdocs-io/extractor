import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('express', () => {
    const name = 'express';

    it('4.17.1', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '4.17.1' });
    });
});
