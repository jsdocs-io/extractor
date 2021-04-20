import * as tsm from 'ts-morph';
import { DeclarationSource } from '../types/module-declarations';
import { getFilename } from './get-filename';
import { getStartLineNumber } from './get-start-line-number';
import { RepositoryFileURLProvider } from './repository-file-url-provider';
import { UnpkgFileURLProvider } from './unpkg-file-url-provider';

export type SourceProvider = ({
    declaration,
}: {
    declaration: tsm.Node;
}) => DeclarationSource;

export function getSourceProvider({
    getRepositoryFileURL,
    getUnpkgFileURL,
}: {
    getRepositoryFileURL: RepositoryFileURLProvider;
    getUnpkgFileURL: UnpkgFileURLProvider;
}): SourceProvider {
    return ({ declaration }) => {
        const filename = getFilename({ declaration });
        const line = getStartLineNumber({ declaration });
        const url = getRepositoryFileURL({ filename, line });
        const unpkgURL = getUnpkgFileURL({ filename, line });
        return { filename, line, url, unpkgURL };
    };
}
