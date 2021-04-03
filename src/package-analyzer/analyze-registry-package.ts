import { performance } from 'perf_hooks';
import { getPackageManifest } from 'query-registry';
import { RegistryPackageInfo } from '../types/registry-package-info';
import { log } from '../utils/log';
import { tryGetPackageAPI } from './try-get-package-api';

/**
 * `analyzeRegistryPackage` analyzes a package hosted on a registry and
 * tries to extract its public API.
 *
 * @example
 * Analyze the latest version of package `query-registry` from the npm registry:
 *
 * ```typescript
 * import { analyzeRegistryPackage } from '@jsdocs-io/package-analyzer';
 *
 * (async () => {
 *     const info = await analyzeRegistryPackage({ name: 'query-registry' });
 *
 *     // Output: 'query-registry'
 *     console.log(info.manifest.name);
 *
 *     // Output: 'string'
 *     console.log(typeof info.api?.overview);
 * })();
 * ```
 *
 * @param name - package name
 * @param version - package version (default: `latest`)
 * @param registry - registry URL (default: npm registry)
 * @param mirrors - URLs of registry mirrors (default: npm registry mirrors)
 * @param ignoreLicense - if `true`, extract API from unlicensed or proprietary packages (default: `false`)
 * @param ignoreFilePatternOptimizations - if `true`, ignore file pattern optimizations for known npm packages (default: `false`)
 *
 * @see {@link RegistryPackageInfo}
 */
export async function analyzeRegistryPackage({
    name,
    version,
    registry,
    mirrors,
    ignoreLicense,
    ignoreFilePatternOptimizations,
}: {
    name: string;
    version?: string;
    registry?: string;
    mirrors?: string[];
    ignoreLicense?: boolean;
    ignoreFilePatternOptimizations?: boolean;
}): Promise<RegistryPackageInfo> {
    const start = performance.now();
    log('analyzeRegistryPackage: analyzing package: %O', { name, version });

    const manifest = await getPackageManifest({
        name,
        version,
        registry,
        mirrors,
    });
    const { id } = manifest;
    log('analyzeRegistryPackage: got manifest: %O', { id, manifest });

    const api = await tryGetPackageAPI({
        manifest,
        ignoreLicense,
        ignoreFilePatternOptimizations,
    });
    log('analyzeRegistryPackage: extracted API: %O', { id, api });

    const elapsed = Math.round(performance.now() - start);
    log('analyzeRegistryPackage: performance (ms): %O', { id, elapsed });

    return {
        id,
        manifest,
        api,
        elapsed,
        createdAt: new Date().toISOString(),
    };
}
