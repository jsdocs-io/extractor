import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('fastify', () => {
    const name = 'fastify';

    it('3.10.1', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '3.10.1' });
    });
});
