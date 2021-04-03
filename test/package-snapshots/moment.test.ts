import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('moment', () => {
    const name = 'moment';

    it('2.29.1', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '2.29.1' });
    });
});
