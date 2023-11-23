import { format } from "prettier";
import type { DeclarationKind } from "../types/declaration-kind";

export const formatSignature = async (
  kind: DeclarationKind,
  signature: string
): Promise<string> => {
  const s = signature
    .trim()
    // Remove unnecessary keywords at declaration start.
    .replace(/^export\s+/, "")
    .replace(/^default\s+/, "")
    .replace(/^declare\s+/, "");
  switch (kind) {
    case "variable": {
      // Temporarily replace the invalid variable name `default` before the type.
      const raw = s.replace("default:", "_______:");
      const formatted = await formatWithPrettier(raw);
      return formatted.replace("_______:", "default:");
    }
    case "function": {
      // Temporarily add `let` to format the function like a variable signature.
      const raw = `let ${s.replace("default:", "_______:")}`;
      const formatted = await formatWithPrettier(raw);
      return formatted.replace("_______:", "default:").replace(/^let\s/, "");
    }
    case "class":
    case "interface":
    case "enum":
    case "typeAlias":
    case "namespace": {
      // Just format the signature as-is.
      const formatted = await formatWithPrettier(s);
      return formatted;
    }
    case "classConstructor":
    case "classProperty":
    case "classMethod":
    case "interfaceProperty":
    case "interfaceMethod":
    case "interfaceConstructSignature":
    case "interfaceCallSignature":
    case "interfaceIndexSignature":
    case "enumMember": {
      // Temporarily wrap members in their parent declaration for formatting.
      const parentKind = kind.split(/[A-Z]/)[0]!;
      const raw = `${parentKind} P { ${s} }`;
      const formattedParent = await formatWithPrettier(raw);
      const formatted = formattedParent
        // Remove parent wrapper on first and last lines.
        .split("\n")
        .slice(1, -1)
        // Remove indentation.
        .map((line) => line.replace(/^\s{4}/, ""))
        .join("\n")
        // Remove trailing comma in enum member signature.
        .replace(/,$/, "");
      return formatted;
    }
  }
};

const formatWithPrettier = async (s: string): Promise<string> => {
  try {
    return (
      await format(s, {
        semi: true,
        singleQuote: true,
        trailingComma: "es5",
        tabWidth: 4,
        printWidth: 85,
        endOfLine: "lf",
        arrowParens: "always",
        parser: "typescript",
      })
    ).trim();
  } catch {
    return s;
  }
};
