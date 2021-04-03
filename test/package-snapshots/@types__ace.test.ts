import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('@types/ace', () => {
    const name = '@types/ace';

    it('0.0.44', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '0.0.44' });
    });
});
