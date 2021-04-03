import * as tsm from 'ts-morph';

export function getApparentType({
    declaration,
}: {
    declaration: tsm.Node;
}): string {
    // See https://github.com/dsherret/ts-morph/issues/453#issuecomment-427405736
    // and https://github.com/dsherret/ts-morph/issues/453#issuecomment-667578386
    return declaration
        .getType()
        .getApparentType()
        .getText(
            declaration,
            tsm.ts.TypeFormatFlags.NoTruncation |
                tsm.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope
        )
        .replace(/^Number$/, 'number')
        .replace(/^Boolean$/, 'boolean')
        .replace(/^String$/, 'string');
}
