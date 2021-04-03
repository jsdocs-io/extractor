import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('immer', () => {
    const name = 'immer';

    it('8.0.1', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '8.0.1' });
    });
});
