import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('axios', () => {
    const name = 'axios';

    it('0.21.1', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '0.21.1' });
    });
});
