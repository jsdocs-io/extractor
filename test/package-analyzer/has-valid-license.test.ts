import { hasValidLicense } from '../../src/package-analyzer/has-valid-license';

describe('hasValidLicense', () => {
    it('ignores invalid licenses when `ignoreLicense` is true', () => {
        const ignoreLicense = true;

        expect(hasValidLicense({ ignoreLicense })).toBeTruthy();

        expect(
            hasValidLicense({ ignoreLicense, license: undefined })
        ).toBeTruthy();

        expect(hasValidLicense({ ignoreLicense, license: '' })).toBeTruthy();

        expect(
            hasValidLicense({ ignoreLicense, license: 'UNLICENSED' })
        ).toBeTruthy();

        expect(
            hasValidLicense({ ignoreLicense, license: 'UNlicensed' })
        ).toBeTruthy();

        expect(
            hasValidLicense({
                ignoreLicense,
                license: 'SEE LICENSE IN <filename>',
            })
        ).toBeTruthy();

        expect(
            hasValidLicense({
                ignoreLicense,
                license: 'see my custom license',
            })
        ).toBeTruthy();
    });

    it('returns false when licenses are invalid', () => {
        expect(hasValidLicense({})).toBeFalsy();

        expect(hasValidLicense({ license: undefined })).toBeFalsy();

        expect(hasValidLicense({ license: '' })).toBeFalsy();

        expect(hasValidLicense({ license: 'UNLICENSED' })).toBeFalsy();

        expect(hasValidLicense({ license: 'UNlicensed' })).toBeFalsy();

        expect(
            hasValidLicense({ license: 'SEE LICENSE IN <filename>' })
        ).toBeFalsy();

        expect(
            hasValidLicense({ license: 'see my custom license' })
        ).toBeFalsy();
    });

    it('returns true when licenses are valid', () => {
        expect(hasValidLicense({ license: 'MIT' })).toBeTruthy();

        expect(hasValidLicense({ license: 'Apache-2.0' })).toBeTruthy();

        expect(hasValidLicense({ license: 'MIT OR Apache-2.0' })).toBeTruthy();
    });
});
