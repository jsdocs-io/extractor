import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('toml', () => {
    const name = 'toml';

    it('3.0.0', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '3.0.0' });
    });
});
