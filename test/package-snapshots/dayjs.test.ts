import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('dayjs', () => {
    const name = 'dayjs';

    it('1.10.4', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '1.10.4' });
    });
});
