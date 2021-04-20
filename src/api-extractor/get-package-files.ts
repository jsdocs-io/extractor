import * as tsm from 'ts-morph';
import { isNamespaceDeclaration } from '../types/declaration-type-guards';
import { Declaration, ModuleDeclarations } from '../types/module-declarations';
import { PackageFile } from '../types/package-file';
import { getFilename } from './get-filename';
import { RepositoryFileURLProvider } from './repository-file-url-provider';
import { UnpkgFileURLProvider } from './unpkg-file-url-provider';

export function getPackageFiles({
    indexFile,
    declarations,
    getRepositoryFileURL,
    getUnpkgFileURL,
}: {
    indexFile: tsm.SourceFile;
    declarations: ModuleDeclarations;
    getRepositoryFileURL: RepositoryFileURLProvider;
    getUnpkgFileURL: UnpkgFileURLProvider;
}): PackageFile[] {
    const indexFilename = getFilename({ declaration: indexFile });
    const declarationFilenames = getDeclarationFilenames({ declarations });

    return Array.from(new Set([indexFilename, ...declarationFilenames]))
        .sort()
        .map((filename) => {
            const url = getRepositoryFileURL({ filename });
            const unpkgURL = getUnpkgFileURL({ filename });

            if (filename === indexFilename) {
                return { isIndexFile: true, filename, url, unpkgURL };
            }

            return { filename, url, unpkgURL };
        });
}

function getDeclarationFilenames({
    declarations,
}: {
    declarations: ModuleDeclarations;
}): string[] {
    return Object.values(declarations)
        .flat()
        .flatMap((declaration: Declaration) => {
            const {
                source: { filename },
            } = declaration;

            if (isNamespaceDeclaration(declaration)) {
                const { declarations } = declaration;
                return [filename, ...getDeclarationFilenames({ declarations })];
            }

            return filename;
        });
}
