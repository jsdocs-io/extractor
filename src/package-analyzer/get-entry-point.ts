import * as path from 'path';
import * as tsm from 'ts-morph';

export function getEntryPoint({
    fileSystem,
    name,
    source,
    types,
    typings,
}: {
    fileSystem: tsm.FileSystemHost;
    name?: string;
    source?: string;
    types?: string;
    typings?: string;
}): string | undefined {
    const filenames = [
        // Try `source` and `types` fields from `package.json` first
        ...getCandidatesForSource({ source }),
        ...getCandidatesForTypes({ types, typings }),
        // Guess for source file
        'public-package-api.ts',
        ...getCandidatesForName({ name, extension: '.ts' }),
        'index.ts',
        'main.ts',
        // Guess for type declarations file
        'public-package-api.d.ts',
        ...getCandidatesForName({ name, extension: '.d.ts' }),
        'index.d.ts',
        'main.d.ts',
    ];

    for (const filename of filenames) {
        const found = fileSystem.globSync([
            `**/${filename}`,
            '!node_modules/*',
        ]);

        const [first] = found.sort((a, b) => {
            const shortestPath = a.split('/').length - b.split('/').length;
            const alphabeticalOrder = a.localeCompare(b);
            return shortestPath || alphabeticalOrder;
        });
        if (first) {
            return first;
        }
    }

    return undefined;
}

function getCandidatesForSource({ source }: { source?: string }): string[] {
    if (!source?.endsWith('.ts')) {
        return [];
    }

    return [path.normalize(source)];
}

function getCandidatesForName({
    name,
    extension,
}: {
    name?: string;
    extension: string;
}): string[] {
    if (!name) {
        return [];
    }

    const normalizedName = name
        .replace('.d.ts', '')
        .replace('.ts', '')
        .replace('.js', '')
        .replace('@', '')
        .replace('/', '__');

    return [`${name}${extension}`, `${normalizedName}${extension}`];
}

function getCandidatesForTypes({
    types: aliasTypes,
    typings: aliasTypings,
}: {
    types?: string;
    typings?: string;
}): string[] {
    const types = aliasTypes || aliasTypings;
    if (!types?.endsWith('.d.ts')) {
        return [];
    }

    return [path.normalize(types)];
}
