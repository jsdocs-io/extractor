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
import { docs } from "./docs";
import { formatSignature } from "./format-signature";
import { headText } from "./head-text";
import { id } from "./id";
import { isHidden } from "./is-hidden";
import { sourceFilePath } from "./source-file-path";
import { typeCheckerType } from "./type-checker-type";

export type ExtractedInterface = {
	kind: "interface";
	id: string;
	name: string;
	docs: string[];
	file: string;
	line: number;
	signature: string;
	properties: ExtractedInterfaceProperty[];
	methods: ExtractedInterfaceMethod[];
	constructSignatures: ExtractedInterfaceConstructSignature[];
	callSignatures: ExtractedInterfaceCallSignature[];
	indexSignatures: ExtractedInterfaceIndexSignature[];
	getAccessors: ExtractedInterfaceGetAccessor[];
	setAccessors: ExtractedInterfaceSetAccessor[];
};

export type ExtractedInterfaceProperty = {
	kind: "interface-property";
	id: string;
	name: string;
	docs: string[];
	file: string;
	line: number;
	signature: string;
};

export type ExtractedInterfaceMethod = {
	kind: "interface-method";
	id: string;
	name: string;
	docs: string[];
	file: string;
	line: number;
	signature: string;
};

export type ExtractedInterfaceConstructSignature = {
	kind: "interface-construct-signature";
	id: string;
	name: string;
	docs: string[];
	file: string;
	line: number;
	signature: string;
};

export type ExtractedInterfaceCallSignature = {
	kind: "interface-call-signature";
	id: string;
	name: string;
	docs: string[];
	file: string;
	line: number;
	signature: string;
};

export type ExtractedInterfaceIndexSignature = {
	kind: "interface-index-signature";
	id: string;
	name: string;
	docs: string[];
	file: string;
	line: number;
	signature: string;
};

export type ExtractedInterfaceGetAccessor = {
	kind: "interface-get-accessor";
	id: string;
	name: string;
	docs: string[];
	file: string;
	line: number;
	signature: string;
};

export type ExtractedInterfaceSetAccessor = {
	kind: "interface-set-accessor";
	id: string;
	name: string;
	docs: string[];
	file: string;
	line: number;
	signature: string;
};

export const extractInterface = async (
	containerName: string,
	exportName: string,
	declaration: InterfaceDeclaration,
): Promise<ExtractedInterface> => {
	const interfaceId = id(containerName, "interface", exportName);
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
		constructSignatures: await extractInterfaceConstructSignatures(
			interfaceId,
			declaration,
		),
		callSignatures: await extractInterfaceCallSignatures(
			interfaceId,
			declaration,
		),
		indexSignatures: await extractInterfaceIndexSignatures(
			interfaceId,
			declaration,
		),
		getAccessors: await extractInterfaceGetAccessors(interfaceId, declaration),
		setAccessors: await extractInterfaceSetAccessors(interfaceId, declaration),
	};
};

const interfaceSignature = async (
	declaration: InterfaceDeclaration,
): Promise<string> => {
	const signature = headText(declaration);
	return formatSignature("interface", signature);
};

const extractInterfaceProperties = async (
	interfaceId: string,
	interfaceDeclaration: InterfaceDeclaration,
): Promise<ExtractedInterfaceProperty[]> => {
	const properties = [];
	for (const declaration of interfaceDeclaration.getProperties()) {
		if (isHidden(declaration)) {
			continue;
		}
		const name = declaration.getName();
		properties.push({
			kind: "interface-property" as const,
			id: id(interfaceId, "property", name),
			name,
			docs: docs(declaration),
			file: sourceFilePath(declaration),
			line: declaration.getStartLineNumber(),
			signature: await interfacePropertySignature(declaration),
		});
	}
	return orderBy(properties, "id");
};

const interfacePropertySignature = async (
	declaration: PropertySignature,
): Promise<string> => {
	const signature = declaration.getText();
	return formatSignature("interface-property", signature);
};

const extractInterfaceMethods = async (
	interfaceId: string,
	interfaceDeclaration: InterfaceDeclaration,
): Promise<ExtractedInterfaceMethod[]> => {
	const methods = [];
	const seenMethods = new Set<string>();
	for (const declaration of interfaceDeclaration.getMethods()) {
		if (isHidden(declaration)) {
			continue;
		}
		const name = declaration.getName();
		if (seenMethods.has(name)) {
			// Skip overloaded methods.
			continue;
		}
		seenMethods.add(name);
		methods.push({
			kind: "interface-method" as const,
			id: id(interfaceId, "method", name),
			name,
			docs: docs(declaration),
			file: sourceFilePath(declaration),
			line: declaration.getStartLineNumber(),
			signature: await interfaceMethodSignature(name, declaration),
		});
	}
	return orderBy(methods, "id");
};

const interfaceMethodSignature = async (
	name: string,
	declaration: MethodSignature,
): Promise<string> => {
	const type = typeCheckerType(declaration);
	return formatSignature("interface-method", `${name}: ${type}`);
};

const extractInterfaceConstructSignatures = async (
	interfaceId: string,
	interfaceDeclaration: InterfaceDeclaration,
): Promise<ExtractedInterfaceConstructSignature[]> => {
	const constructSignatures = [];
	for (const [index, declaration] of interfaceDeclaration
		.getConstructSignatures()
		.entries()) {
		if (isHidden(declaration)) {
			continue;
		}
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
};

const interfaceConstructSignatureSignature = async (
	declaration: ConstructSignatureDeclaration,
): Promise<string> => {
	const signature = declaration.getText();
	return formatSignature("interface-construct-signature", signature);
};

const extractInterfaceCallSignatures = async (
	interfaceId: string,
	interfaceDeclaration: InterfaceDeclaration,
): Promise<ExtractedInterfaceCallSignature[]> => {
	const callSignatures = [];
	for (const [index, declaration] of interfaceDeclaration
		.getCallSignatures()
		.entries()) {
		if (isHidden(declaration)) {
			continue;
		}
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
};

const interfaceCallSignatureSignature = async (
	declaration: CallSignatureDeclaration,
): Promise<string> => {
	const signature = declaration.getText();
	return formatSignature("interface-call-signature", signature);
};

const extractInterfaceIndexSignatures = async (
	interfaceId: string,
	interfaceDeclaration: InterfaceDeclaration,
): Promise<ExtractedInterfaceIndexSignature[]> => {
	const indexSignatures = [];
	for (const [index, declaration] of interfaceDeclaration
		.getIndexSignatures()
		.entries()) {
		if (isHidden(declaration)) {
			continue;
		}
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
};

const interfaceIndexSignatureSignature = async (
	declaration: IndexSignatureDeclaration,
): Promise<string> => {
	const signature = declaration.getText();
	return formatSignature("interface-index-signature", signature);
};

const extractInterfaceGetAccessors = async (
	interfaceId: string,
	interfaceDeclaration: InterfaceDeclaration,
): Promise<ExtractedInterfaceGetAccessor[]> => {
	const getAccessors = [];
	for (const declaration of interfaceDeclaration.getGetAccessors()) {
		if (isHidden(declaration)) {
			continue;
		}
		const name = declaration.getName();
		getAccessors.push({
			kind: "interface-get-accessor" as const,
			id: id(interfaceId, "get-accessor", name),
			name,
			docs: docs(declaration),
			file: sourceFilePath(declaration),
			line: declaration.getStartLineNumber(),
			signature: await interfaceGetAccessorSignature(declaration),
		});
	}
	return orderBy(getAccessors, "id");
};

const interfaceGetAccessorSignature = async (
	declaration: GetAccessorDeclaration,
): Promise<string> => {
	const signature = declaration.getText();
	return formatSignature("interface-get-accessor", signature);
};

const extractInterfaceSetAccessors = async (
	interfaceId: string,
	interfaceDeclaration: InterfaceDeclaration,
): Promise<ExtractedInterfaceSetAccessor[]> => {
	const setAccessors = [];
	for (const declaration of interfaceDeclaration.getSetAccessors()) {
		if (isHidden(declaration)) {
			continue;
		}
		const name = declaration.getName();
		setAccessors.push({
			kind: "interface-set-accessor" as const,
			id: id(interfaceId, "set-accessor", name),
			name,
			docs: docs(declaration),
			file: sourceFilePath(declaration),
			line: declaration.getStartLineNumber(),
			signature: await interfaceSetAccessorSignature(declaration),
		});
	}
	return orderBy(setAccessors, "id");
};

const interfaceSetAccessorSignature = async (
	declaration: SetAccessorDeclaration,
): Promise<string> => {
	const signature = declaration.getText();
	return formatSignature("interface-get-accessor", signature);
};
