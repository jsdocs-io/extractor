import { expectPackageAPIToMatchSnapshot } from '../helpers/expect-package-api-to-match-snapshot';

describe('enttec-open-dmx-usb', () => {
    const name = 'enttec-open-dmx-usb';

    it('2.0.0', async () => {
        await expectPackageAPIToMatchSnapshot({ name, version: '2.0.0' });
    });
});
