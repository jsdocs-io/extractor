// Set env var `DEBUG='@jsdocs-io/extractor'` and run with `yarn debug:analyze`

import { analyzeRegistryPackage } from '../dist';

(async () => {
    const info = await analyzeRegistryPackage({ name: '@jsdocs-io/extractor' });
    console.log(info);
})();
