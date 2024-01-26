export type ExtractorError =
  | OsError
  | FsError
  | InstallPackageError
  | PackageNameError
  | PackageJsonError
  | PackageTypesError
  | PackageDeclarationsError
  | ProjectError;

export class OsError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    // For all errors see the following links:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#differentiate_between_similar_errors
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause
    // https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript
    super(message, options);
    this.name = this.constructor.name;
  }
}

export class FsError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

export class InstallPackageError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

export class PackageNameError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

export class PackageJsonError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

export class PackageTypesError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

export class PackageDeclarationsError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

export class ProjectError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}
