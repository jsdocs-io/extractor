import { TSDocParser, type DocComment } from "@microsoft/tsdoc";
import memoize from "memoize";

export const parseDocComment = memoize((s: string): DocComment => {
  const parser = new TSDocParser();
  return parser.parseString(s).docComment;
});
