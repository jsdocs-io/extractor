import type { TypeAliasDeclaration } from "ts-morph";
import { docs } from "./docs";
import { formatSignature } from "./format-signature";
import { id } from "./id";
import { sourceFilePath } from "./source-file-path";

export type ExtractedTypeAlias = {
	kind: "type";
	id: string;
	name: string;
	docs: string[];
	file: string;
	line: number;
	signature: string;
};

export const extractTypeAlias = async (
	containerName: string,
	exportName: string,
	declaration: TypeAliasDeclaration,
): Promise<ExtractedTypeAlias> => ({
	kind: "type",
	id: id(containerName, "+type", exportName),
	name: exportName,
	docs: docs(declaration),
	file: sourceFilePath(declaration),
	line: declaration.getStartLineNumber(),
	signature: await typeAliasSignature(declaration),
});

const typeAliasSignature = async (declaration: TypeAliasDeclaration): Promise<string> => {
	// Using `declaration.getType().getText(declaration);` returns the expanded/resolved type.
	// However this causes:
	// - inline imports like `import('...').SomeType` to appear in the signature
	// - types can become really long in some cases as they are expanded by the compiler
	// - format flags like `TypeFormatFlags.NoTruncation | TypeFormatFlags.UseAliasDefinedOutsideCurrentScope`
	//   seem to be ignored or cause local types to be resolved to their name like `type Foo = Foo;`
	// For these reasons we simply get the type alias text as written by authors.
	// See:
	// - https://github.com/dsherret/ts-morph/issues/453#issuecomment-427405736
	// - https://twitter.com/drosenwasser/status/1289640180035403776
	const signature = declaration.getText();
	return await formatSignature("type", signature);
};
