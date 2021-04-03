import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('faastjs', () => {
    const name = 'faastjs';

    it('5.3.8', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '5.3.8' });
    });
});
