import { EnumMember, type EnumDeclaration } from "ts-morph";
import { docs } from "./docs.ts";
import { formatSignature } from "./format-signature.ts";
import { headText } from "./head-text.ts";
import { id } from "./id.ts";
import { isHidden } from "./is-hidden.ts";
import { sourceFilePath } from "./source-file-path.ts";
import type { ExtractedEnum, ExtractedEnumMember } from "./types.ts";

export async function extractEnum(
	containerName: string,
	exportName: string,
	declaration: EnumDeclaration,
): Promise<ExtractedEnum> {
	const enumId = id(containerName, "+enum", exportName);
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
}

async function enumSignature(declaration: EnumDeclaration): Promise<string> {
	const signature = headText(declaration);
	return await formatSignature("enum", signature);
}

async function extractEnumMembers(
	enumId: string,
	enumDeclaration: EnumDeclaration,
): Promise<ExtractedEnumMember[]> {
	const members = [];
	for (const declaration of enumDeclaration.getMembers()) {
		if (isHidden(declaration)) continue;
		const name = declaration.getName();
		members.push({
			kind: "enum-member" as const,
			id: id(enumId, "+member", name),
			name,
			docs: docs(declaration),
			file: sourceFilePath(declaration),
			line: declaration.getStartLineNumber(),
			signature: await enumMemberSignature(declaration),
		});
	}
	return members;
}

async function enumMemberSignature(declaration: EnumMember): Promise<string> {
	const signature = declaration.getText();
	return await formatSignature("enum-member", signature);
}
