import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('webpack', () => {
    const name = 'webpack';

    it('5.17.0', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '5.17.0' });
    });
});
