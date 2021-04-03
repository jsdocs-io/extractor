import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('tiny-lru', () => {
    const name = 'tiny-lru';

    it('7.0.6', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '7.0.6' });
    });
});
