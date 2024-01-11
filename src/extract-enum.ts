import { EnumMember, type EnumDeclaration } from "ts-morph";
import { docs } from "./docs";
import { formatSignature } from "./format-signature";
import { headText } from "./head-text";
import { id } from "./id";
import { isHidden } from "./is-hidden";
import { sourceFilePath } from "./source-file-path";

export type ExtractedEnum = {
  kind: "enum";
  id: string;
  name: string;
  docs: string[];
  file: string;
  line: number;
  signature: string;
  members: ExtractedEnumMember[];
};

export type ExtractedEnumMember = {
  kind: "enum-member";
  id: string;
  name: string;
  docs: string[];
  file: string;
  line: number;
  signature: string;
};

export const extractEnum = async (
  containerName: string,
  exportName: string,
  declaration: EnumDeclaration,
): Promise<ExtractedEnum> => {
  const enumId = id(containerName, "enum", exportName);
  return {
    kind: "enum",
    id: enumId,
    name: exportName,
    docs: docs(declaration),
    file: sourceFilePath(declaration),
    line: declaration.getStartLineNumber(),
    signature: await enumSignature(declaration),
    members: await extractEnumMembers(enumId, declaration),
  };
};

const enumSignature = (declaration: EnumDeclaration): Promise<string> => {
  const signature = headText(declaration);
  return formatSignature("enum", signature);
};

const extractEnumMembers = async (
  enumId: string,
  enumDeclaration: EnumDeclaration,
): Promise<ExtractedEnumMember[]> => {
  const members = [];
  for (const declaration of enumDeclaration.getMembers()) {
    if (isHidden(declaration)) {
      continue;
    }
    const name = declaration.getName();
    members.push({
      kind: "enum-member" as const,
      id: id(enumId, "member", name),
      name,
      docs: docs(declaration),
      file: sourceFilePath(declaration),
      line: declaration.getStartLineNumber(),
      signature: await enumMemberSignature(declaration),
    });
  }
  return members;
};

const enumMemberSignature = (declaration: EnumMember): Promise<string> => {
  const signature = declaration.getText();
  return formatSignature("enum-member", signature);
};
