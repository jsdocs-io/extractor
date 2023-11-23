import * as prettier from "prettier";
import { log } from "../utils/log";

const formatOptions: prettier.Options = {
  semi: true,
  singleQuote: true,
  trailingComma: "es5",
  tabWidth: 4,
  printWidth: 85,
  endOfLine: "lf",
  arrowParens: "always",
  parser: "typescript",
};

export function formatFunctionSignature(text: string): string {
  const varLike = `let ${text}`;
  return formatVariableSignature(varLike).replace(/^let\s/, "");
}

export function formatVariableSignature(text: string): string {
  // Temporarily replace the invalid variable name `default`
  const escapedText = text.replace("default:", "_______:");
  return formatText(escapedText).replace("_______:", "default:");
}

export function formatClassMember(text: string): string {
  const wrapped = `class C { ${text} }`;
  return formatWrappedMember(wrapped);
}

export function formatInterfaceMember(text: string): string {
  const wrapped = `interface I { ${text} }`;
  return formatWrappedMember(wrapped);
}

export function formatEnumMember(text: string): string {
  const wrapped = `enum E { ${text} }`;
  return formatWrappedMember(wrapped).replace(/,$/, "");
}

function formatWrappedMember(text: string): string {
  const formatted = formatText(text);
  const lines = formatted.split("\n");

  // Remove wrapper and member indentation
  const member = lines
    .slice(1, lines.length - 1)
    .map((line) => line.replace(/^\s{4}/, ""))
    .join("\n");

  return member;
}

export function formatText(text: string): string {
  let formatted = text
    .trim()
    .replace(/^export\s+/, "")
    .replace(/^default\s+/, "")
    .replace(/^declare\s+/, "");

  try {
    formatted = prettier.format(formatted, formatOptions);
  } catch (err) {
    // istanbul ignore next
    log("formatText: formatting error: %O", { err });
  }

  return formatted.trim();
}
