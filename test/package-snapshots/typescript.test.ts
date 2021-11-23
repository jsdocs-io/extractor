import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('typescript', () => {
    const name = 'typescript';

    it('4.5.2', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '4.5.2' });
    });
});
