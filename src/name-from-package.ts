export const nameFromPackage = (pkg: string): string => {
  const versionMarker = pkg.lastIndexOf("@");
  return pkg.slice(0, versionMarker > 0 ? versionMarker : undefined);
};
