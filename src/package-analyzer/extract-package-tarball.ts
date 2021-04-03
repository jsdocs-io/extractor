import concat from 'concat-stream';
import stream from 'stream';
import tar from 'tar-stream';
import * as tsm from 'ts-morph';
import { toForwardSlashes } from '../utils/to-forward-slashes';

export function extractPackageTarball({
    fileSystem,
}: {
    fileSystem: tsm.FileSystemHost;
}): stream.Writable {
    const extract = tar.extract();

    extract.on('entry', (header, stream, next) => {
        const { type, name } = header;
        const filename = normalizeEntryFilename({ name });
        if (!shouldExtractEntry({ type, filename })) {
            // Drain this stream and go to next entry
            stream.resume();
            return next();
        }

        stream.pipe(
            concat((data) => {
                const contents = data.toString();
                fileSystem.writeFileSync(filename, contents);
                next();
            })
        );
    });

    return extract;
}

function shouldExtractEntry({
    type,
    filename,
}: {
    type: string | null | undefined;
    filename: string;
}): boolean {
    if (type !== 'file') {
        return false;
    }

    return filename.endsWith('.ts');
}

/**
 * `normalizeEntryFilename` removes the root directory present in npm packages
 * from the names of entries (for example, `package/src/index.ts` => `src/index.ts`).
 */
function normalizeEntryFilename({ name }: { name: string }): string {
    return toForwardSlashes(name).split('/').slice(1).join('/');
}
