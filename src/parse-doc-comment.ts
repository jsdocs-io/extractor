import { TSDocParser, type DocComment } from "@microsoft/tsdoc";
import memoize from "memoize";

/** @internal */
export const parseDocComment = memoize((s: string): DocComment => {
  const parser = new TSDocParser();
  return parser.parseString(s).docComment;
});
