import * as tsm from 'ts-morph';
import { DeclarationSource } from '../types/module-declarations';
import { getFilename } from './get-filename';
import { getStartLineNumber } from './get-start-line-number';
import { RepositoryFileURLProvider } from './repository-file-url-provider';

export type SourceProvider = ({
    declaration,
}: {
    declaration: tsm.Node;
}) => DeclarationSource;

export function getSourceProvider({
    getRepositoryFileURL,
}: {
    getRepositoryFileURL: RepositoryFileURLProvider;
}): SourceProvider {
    return ({ declaration }) => {
        const filename = getFilename({ declaration });
        const line = getStartLineNumber({ declaration });
        const url = getRepositoryFileURL({ filename, line });
        return { filename, line, url };
    };
}
