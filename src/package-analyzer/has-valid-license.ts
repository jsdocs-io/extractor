export function hasValidLicense({
    license,
    ignoreLicense = false,
}: {
    license?: string;
    ignoreLicense?: boolean;
}): boolean {
    if (ignoreLicense) {
        return true;
    }

    return (
        !!license &&
        license.toLowerCase() !== 'unlicensed' &&
        !license.toLowerCase().startsWith('see ')
    );
}
