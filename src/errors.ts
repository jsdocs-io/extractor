/**
`ExtractorError` is the union of all possible errors that can happen when
analyzing a package and extracting its API.
*/
export type ExtractorError =
  | FsError
  | InstallPackageError
  | PackageNameError
  | PackageJsonError
  | PackageTypesError
  | PackageDeclarationsError
  | ProjectError;

// For all errors see the following links:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#differentiate_between_similar_errors
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause
// https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript

/**
`FsError` is thrown when an operation involving the file system fails.
*/
export class FsError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

/**
`InstallPackageError` is thrown when installing a package fails.
*/
export class InstallPackageError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

/**
`PackageNameError` is thrown when a package name is not valid.
*/
export class PackageNameError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

/**
`PackageJsonError` is thrown when reading `package.json` fails.
*/
export class PackageJsonError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

/**
`PackageTypesError` is thrown when resolving the types entrypoint file fails.
*/
export class PackageTypesError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

/**
`PackageDeclarationsError` is thrown when extracting declarations fails.
*/
export class PackageDeclarationsError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

/**
`ProjectError` is thrown when creating a TypeScript project fails.
*/
export class ProjectError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}
