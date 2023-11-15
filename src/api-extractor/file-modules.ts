import * as tsm from 'ts-morph';
import {
    DeclarationKinds,
    ModuleDeclarations,
    NamespaceDeclaration,
} from '../types/module-declarations';
import { formatText } from './format';
import { getFilename } from './get-filename';
import { SourceProvider } from './source-provider';

export function isFileModule(
    declaration: tsm.Node
): declaration is tsm.SourceFile {
    return tsm.Node.isSourceFile(declaration);
}

export function newFileModule({
    id,
    name,
    declaration,
    declarations,
    getSource,
}: {
    id: string;
    name: string;
    declaration: tsm.SourceFile;
    declarations: ModuleDeclarations;
    getSource: SourceProvider;
}): NamespaceDeclaration {
    const kind = DeclarationKinds.NamespaceDeclaration;
    const docs = getFileModuleDocs({ declaration });
    const source = getSource({ declaration });
    const signature = getFileModuleSignature({ declaration });

    return {
        kind,
        id,
        name,
        docs,
        source,
        signature,
        declarations,
    };
}

function getFileModuleDocs({
    declaration,
}: {
    declaration: tsm.SourceFile;
}): string[] {
    const doc = declaration
        .getDescendantsOfKind(tsm.SyntaxKind.JSDoc)[0]
        ?.getText();

    return doc ? [doc] : [];
}

function getFileModuleSignature({
    declaration,
}: {
    declaration: tsm.SourceFile;
}): string {
    const filename = getFilename({ declaration });
    const signature = `module '${filename}' {}`;
    return formatText(signature);
}
