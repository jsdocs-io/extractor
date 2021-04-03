import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('mobx', () => {
    const name = 'mobx';

    it('6.0.5', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '6.0.5' });
    });
});
