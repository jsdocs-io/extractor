import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('@types/fs-extra', () => {
    const name = '@types/fs-extra';

    it('9.0.6', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '9.0.6' });
    });
});
