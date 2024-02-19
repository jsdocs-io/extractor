# @jsdocs-io/extractor

[![Build status](https://img.shields.io/github/actions/workflow/status/jsdocs-io/extractor/main.yml?branch=main)](https://github.com/jsdocs-io/extractor/actions/workflows/main.yml?query=workflow%3ACI)
[![Coverage](https://img.shields.io/codecov/c/gh/jsdocs-io/extractor)](https://codecov.io/gh/jsdocs-io/extractor)
[![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/@jsdocs-io/extractor)
![Language](https://img.shields.io/github/languages/top/jsdocs-io/extractor)
[![npm](https://img.shields.io/npm/v/@jsdocs-io/extractor)](https://www.npmjs.com/package/@jsdocs-io/extractor)
[![License](https://img.shields.io/github/license/jsdocs-io/extractor)](https://github.com/jsdocs-io/extractor/blob/main/LICENSE)

This is the API extractor powering [**jsDocs.io**](https://www.jsdocs.io).

It downloads packages from the npm registry and analyzes them to extract their public API.

## Requirements

- [Bun](https://bun.sh/) must be installed to resolve and install packages

## API & Package Info

- Explore the API on [**jsDocs.io**](https://www.jsdocs.io/package/@jsdocs-io/extractor)
- View package contents on [**unpkg**](https://unpkg.com/@jsdocs-io/extractor/)
- View repository on [**GitHub**](https://github.com/jsdocs-io/extractor)
- Read the changelog on [**GitHub**](https://github.com/jsdocs-io/extractor/blob/main/CHANGELOG.md)

## Usage Examples

> [!WARNING]
> Analyzing packages is a blocking operation that requires some time, even seconds, to finish!
> Using workers is recommended.

1. Analyze the latest version of the `preact` package from the npm registry:

```ts
import { extractPackageApi } from "@jsdocs-io/extractor";

(async () => {
  const result = await extractPackageApi({ pkg: "preact" });
  if (result.isOk()) {
    const packageApi = result.value; // Successfully extracted API
    console.log(JSON.stringify(packageApi, null, 2));
  } else {
    const extractorError = result.error; // Error extracting API
    console.error(extractorError);
  }
})();
```

2. Analyze a specific [subpath export](https://nodejs.org/api/packages.html#subpath-exports), like `preact/hooks`:

```ts
import { extractPackageApi } from "@jsdocs-io/extractor";

(async () => {
  const result = await extractPackageApi({ pkg: "preact", subpath: "hooks" });
  if (result.isOk()) {
    const packageApi = result.value; // Successfully extracted API
    console.log(JSON.stringify(packageApi, null, 2));
  } else {
    const extractorError = result.error; // Error extracting API
    console.error(extractorError);
  }
})();
```

## License

    AGPL-3.0-or-later

Copyright (C) 2024 Edoardo Scibona. See [LICENSE](LICENSE).

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
