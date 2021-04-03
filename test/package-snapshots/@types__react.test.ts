import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('@types/react', () => {
    const name = '@types/react';

    it('17.0.0', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '17.0.0' });
    });
});
