import { TypeFormatFlags, ts, type Node } from "ts-morph";

export function apparentType(node: Node): string {
	// See:
	// https://github.com/dsherret/ts-morph/issues/453#issuecomment-427405736
	// https://github.com/dsherret/ts-morph/issues/453#issuecomment-667578386
	return node
		.getType()
		.getApparentType()
		.getText(
			node,
			ts.TypeFormatFlags.NoTruncation | TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
		)
		.replace(/^Number$/, "number")
		.replace(/^Boolean$/, "boolean")
		.replace(/^String$/, "string");
}
