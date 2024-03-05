import { TSDocParser, type DocComment } from "@microsoft/tsdoc";
import memoize from "memoize";

/**
`parseDocComment` parses a JSDoc comment using `@microsoft/tsdoc`.

Parsed comments are memoized.

@param s - the raw string comment

@internal
*/
export const parseDocComment = memoize((s: string): DocComment => {
	const parser = new TSDocParser();
	return parser.parseString(s).docComment;
});
