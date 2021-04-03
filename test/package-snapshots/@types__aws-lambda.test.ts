import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('@types/aws-lambda', () => {
    const name = '@types/aws-lambda';

    it('8.10.71', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '8.10.71' });
    });
});
