import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('typescript', () => {
    const name = 'typescript';

    it('4.1.3', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '4.1.3' });
    });
});
