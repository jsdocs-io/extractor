import { describe, it } from 'vitest';
import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('svelte', () => {
    const name = 'svelte';

    it('3.31.2', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '3.31.2' });
    });
});
