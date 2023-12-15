export type ExtractorError =
  | "InvalidPackageName"
  | "CurrentDirFailed"
  | "TemporaryDirFailed"
  | "ChangeDirFailed"
  | "InstallPackageFailed"
  | "ReadPackageJsonFailed"
  | "ResolveTypesFailed"
  | "CreateProjectFailed";

export const errInvalidPackageName = (): ExtractorError => "InvalidPackageName";

export const errCurrentDirFailed = (): ExtractorError => "CurrentDirFailed";

export const errTemporaryDirFailed = (): ExtractorError => "TemporaryDirFailed";

export const errChangeDirFailed = (): ExtractorError => "ChangeDirFailed";

export const errInstallPackageFailed = (): ExtractorError =>
  "InstallPackageFailed";

export const errReadPackageJsonFailed = (): ExtractorError =>
  "ReadPackageJsonFailed";

export const errResolveTypesFailed = (): ExtractorError => "ResolveTypesFailed";

export const errCreateProjectFailed = (): ExtractorError =>
  "CreateProjectFailed";
