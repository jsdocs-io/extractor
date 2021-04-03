# @jsdocs-io/extractor

[![Build status](https://img.shields.io/github/workflow/status/jsdocs-io/extractor/CI/main)](https://github.com/jsdocs-io/extractor/actions?query=workflow%3ACI)
[![Coverage](https://img.shields.io/codecov/c/gh/jsdocs-io/extractor)](https://codecov.io/gh/jsdocs-io/extractor)
[![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/@jsdocs-io/extractor)
![Language](https://img.shields.io/github/languages/top/jsdocs-io/extractor)
[![Dependencies](https://img.shields.io/david/jsdocs-io/extractor)](https://david-dm.org/jsdocs-io/extractor)
[![npm](https://img.shields.io/npm/v/@jsdocs-io/extractor)](https://www.npmjs.com/package/@jsdocs-io/extractor)
[![License](https://img.shields.io/github/license/jsdocs-io/extractor)](https://github.com/jsdocs-io/extractor/blob/main/LICENSE)

This package downloads npm packages and extracts their public API.

## API & Package Info

-   Explore the API on [**jsDocs.io**](https://www.jsdocs.io/package/@jsdocs-io/extractor)
-   View package contents on [**unpkg**](https://unpkg.com/@jsdocs-io/extractor/)
-   View repository on [**GitHub**](https://github.com/jsdocs-io/extractor)
-   Read the changelog on [**GitHub**](https://github.com/jsdocs-io/extractor/blob/main/CHANGELOG.md)

## Install

Using `npm`:

```
npm i @jsdocs-io/extractor
```

Using `yarn`:

```
yarn add @jsdocs-io/extractor
```

## Usage Example

Analyze the latest version of the `query-registry` package from the npm registry:

> **Warning**: analyzing packages is a blocking operation that requires some time to finish!

```typescript
import { analyzeRegistryPackage } from '@jsdocs-io/extractor';

(async () => {
    const info = await analyzeRegistryPackage({ name: 'query-registry' });

    // Output: 'query-registry'
    console.log(info.manifest.name);

    // Output: 'string'
    console.log(typeof info.api?.overview);
})();
```

## Debug

Debug messages are available when the `DEBUG` environment variable is set to `@jsdocs-io/extractor`:

```bash
DEBUG="@jsdocs-io/extractor"
```

For more information, see the [debug package](https://www.npmjs.com/package/debug).

## License

    AGPL-3.0-or-later

Copyright (C) 2021 Edoardo Scibona

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
