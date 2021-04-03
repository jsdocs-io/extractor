import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('@microsoft/api-extractor', () => {
    const name = '@microsoft/api-extractor';

    it('7.13.0', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '7.13.0' });
    });
});
