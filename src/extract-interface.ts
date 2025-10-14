import { orderBy } from "natural-orderby";
import {
	CallSignatureDeclaration,
	ConstructSignatureDeclaration,
	GetAccessorDeclaration,
	IndexSignatureDeclaration,
	InterfaceDeclaration,
	MethodSignature,
	PropertySignature,
	SetAccessorDeclaration,
} from "ts-morph";
import { docs } from "./docs.ts";
import { formatSignature } from "./format-signature.ts";
import { headText } from "./head-text.ts";
import { id } from "./id.ts";
import { isHidden } from "./is-hidden.ts";
import { sourceFilePath } from "./source-file-path.ts";
import { typeCheckerType } from "./type-checker-type.ts";
import type {
	ExtractedInterface,
	ExtractedInterfaceCallSignature,
	ExtractedInterfaceConstructSignature,
	ExtractedInterfaceGetAccessor,
	ExtractedInterfaceIndexSignature,
	ExtractedInterfaceMethod,
	ExtractedInterfaceProperty,
	ExtractedInterfaceSetAccessor,
} from "./types.ts";

export async function extractInterface(
	containerName: string,
	exportName: string,
	declaration: InterfaceDeclaration,
): Promise<ExtractedInterface> {
	const interfaceId = id(containerName, "+interface", exportName);
	return {
		kind: "interface",
		id: interfaceId,
		name: exportName,
		docs: docs(declaration),
		file: sourceFilePath(declaration),
		line: declaration.getStartLineNumber(),
		signature: await interfaceSignature(declaration),
		properties: await extractInterfaceProperties(interfaceId, declaration),
		methods: await extractInterfaceMethods(interfaceId, declaration),
		constructSignatures: await extractInterfaceConstructSignatures(interfaceId, declaration),
		callSignatures: await extractInterfaceCallSignatures(interfaceId, declaration),
		indexSignatures: await extractInterfaceIndexSignatures(interfaceId, declaration),
		getAccessors: await extractInterfaceGetAccessors(interfaceId, declaration),
		setAccessors: await extractInterfaceSetAccessors(interfaceId, declaration),
	};
}

async function interfaceSignature(declaration: InterfaceDeclaration): Promise<string> {
	const signature = headText(declaration);
	return await formatSignature("interface", signature);
}

async function extractInterfaceProperties(
	interfaceId: string,
	interfaceDeclaration: InterfaceDeclaration,
): Promise<ExtractedInterfaceProperty[]> {
	const properties = [];
	for (const declaration of interfaceDeclaration.getProperties()) {
		if (isHidden(declaration)) continue;
		const name = declaration.getName();
		properties.push({
			kind: "interface-property" as const,
			id: id(interfaceId, "+property", name),
			name,
			docs: docs(declaration),
			file: sourceFilePath(declaration),
			line: declaration.getStartLineNumber(),
			signature: await interfacePropertySignature(declaration),
		});
	}
	return orderBy(properties, "id");
}

async function interfacePropertySignature(declaration: PropertySignature): Promise<string> {
	const signature = declaration.getText();
	return await formatSignature("interface-property", signature);
}

async function extractInterfaceMethods(
	interfaceId: string,
	interfaceDeclaration: InterfaceDeclaration,
): Promise<ExtractedInterfaceMethod[]> {
	const methods = [];
	const seenMethods = new Set<string>();
	for (const declaration of interfaceDeclaration.getMethods()) {
		if (isHidden(declaration)) continue;
		const name = declaration.getName();

		// Skip overloaded methods.
		if (seenMethods.has(name)) continue;

		seenMethods.add(name);
		methods.push({
			kind: "interface-method" as const,
			id: id(interfaceId, "+method", name),
			name,
			docs: docs(declaration),
			file: sourceFilePath(declaration),
			line: declaration.getStartLineNumber(),
			signature: await interfaceMethodSignature(name, declaration),
		});
	}
	return orderBy(methods, "id");
}

async function interfaceMethodSignature(
	name: string,
	declaration: MethodSignature,
): Promise<string> {
	const type = typeCheckerType(declaration);
	return await formatSignature("interface-method", `${name}: ${type}`);
}

async function extractInterfaceConstructSignatures(
	interfaceId: string,
	interfaceDeclaration: InterfaceDeclaration,
): Promise<ExtractedInterfaceConstructSignature[]> {
	const constructSignatures = [];
	for (const [index, declaration] of interfaceDeclaration.getConstructSignatures().entries()) {
		if (isHidden(declaration)) continue;
		constructSignatures.push({
			kind: "interface-construct-signature" as const,
			id: id(interfaceId, "construct-signature", index > 0 ? `${index}` : ""),
			name: "construct-signature",
			docs: docs(declaration),
			file: sourceFilePath(declaration),
			line: declaration.getStartLineNumber(),
			signature: await interfaceConstructSignatureSignature(declaration),
		});
	}
	return orderBy(constructSignatures, "id");
}

async function interfaceConstructSignatureSignature(
	declaration: ConstructSignatureDeclaration,
): Promise<string> {
	const signature = declaration.getText();
	return await formatSignature("interface-construct-signature", signature);
}

async function extractInterfaceCallSignatures(
	interfaceId: string,
	interfaceDeclaration: InterfaceDeclaration,
): Promise<ExtractedInterfaceCallSignature[]> {
	const callSignatures = [];
	for (const [index, declaration] of interfaceDeclaration.getCallSignatures().entries()) {
		if (isHidden(declaration)) continue;
		callSignatures.push({
			kind: "interface-call-signature" as const,
			id: id(interfaceId, "call-signature", index > 0 ? `${index}` : ""),
			name: "call-signature",
			docs: docs(declaration),
			file: sourceFilePath(declaration),
			line: declaration.getStartLineNumber(),
			signature: await interfaceCallSignatureSignature(declaration),
		});
	}
	return orderBy(callSignatures, "id");
}

async function interfaceCallSignatureSignature(
	declaration: CallSignatureDeclaration,
): Promise<string> {
	const signature = declaration.getText();
	return await formatSignature("interface-call-signature", signature);
}

async function extractInterfaceIndexSignatures(
	interfaceId: string,
	interfaceDeclaration: InterfaceDeclaration,
): Promise<ExtractedInterfaceIndexSignature[]> {
	const indexSignatures = [];
	for (const [index, declaration] of interfaceDeclaration.getIndexSignatures().entries()) {
		if (isHidden(declaration)) continue;
		indexSignatures.push({
			kind: "interface-index-signature" as const,
			id: id(interfaceId, "index-signature", index > 0 ? `${index}` : ""),
			name: "index-signature",
			docs: docs(declaration),
			file: sourceFilePath(declaration),
			line: declaration.getStartLineNumber(),
			signature: await interfaceIndexSignatureSignature(declaration),
		});
	}
	return orderBy(indexSignatures, "id");
}

async function interfaceIndexSignatureSignature(
	declaration: IndexSignatureDeclaration,
): Promise<string> {
	const signature = declaration.getText();
	return await formatSignature("interface-index-signature", signature);
}

async function extractInterfaceGetAccessors(
	interfaceId: string,
	interfaceDeclaration: InterfaceDeclaration,
): Promise<ExtractedInterfaceGetAccessor[]> {
	const getAccessors = [];
	for (const declaration of interfaceDeclaration.getGetAccessors()) {
		if (isHidden(declaration)) continue;
		const name = declaration.getName();
		getAccessors.push({
			kind: "interface-get-accessor" as const,
			id: id(interfaceId, "+get-accessor", name),
			name,
			docs: docs(declaration),
			file: sourceFilePath(declaration),
			line: declaration.getStartLineNumber(),
			signature: await interfaceGetAccessorSignature(declaration),
		});
	}
	return orderBy(getAccessors, "id");
}

async function interfaceGetAccessorSignature(declaration: GetAccessorDeclaration): Promise<string> {
	const signature = declaration.getText();
	return await formatSignature("interface-get-accessor", signature);
}

async function extractInterfaceSetAccessors(
	interfaceId: string,
	interfaceDeclaration: InterfaceDeclaration,
): Promise<ExtractedInterfaceSetAccessor[]> {
	const setAccessors = [];
	for (const declaration of interfaceDeclaration.getSetAccessors()) {
		if (isHidden(declaration)) continue;
		const name = declaration.getName();
		setAccessors.push({
			kind: "interface-set-accessor" as const,
			id: id(interfaceId, "+set-accessor", name),
			name,
			docs: docs(declaration),
			file: sourceFilePath(declaration),
			line: declaration.getStartLineNumber(),
			signature: await interfaceSetAccessorSignature(declaration),
		});
	}
	return orderBy(setAccessors, "id");
}

async function interfaceSetAccessorSignature(declaration: SetAccessorDeclaration): Promise<string> {
	const signature = declaration.getText();
	return await formatSignature("interface-get-accessor", signature);
}
