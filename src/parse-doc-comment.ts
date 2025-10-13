import { TSDocParser, type DocComment } from "@microsoft/tsdoc";
import memoize from "memoize";

/**
`parseDocComment` parses a JSDoc comment using `@microsoft/tsdoc`.

@remarks
Parsed comments are memoized.

@param comment - the raw string comment
*/
export const parseDocComment = memoize((comment: string): DocComment => {
	const parser = new TSDocParser();
	return parser.parseString(comment).docComment;
});
