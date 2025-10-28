import { fromPartial } from "@total-typescript/shoehorn";
import { SyntaxKind } from "ts-morph";
import { expect, test } from "vitest";
import { modifiersText } from "./modifiers-text.ts";

test("ignore public keyword", () => {
	expect(
		modifiersText(
			fromPartial({
				getModifiers() {
					return [
						{
							getKind() {
								return SyntaxKind.PublicKeyword;
							},
							getText() {
								return "public";
							},
						},
					];
				},
			}),
		),
	).toBe("");
});

test("collect and return modifiers", () => {
	expect(
		modifiersText(
			fromPartial({
				getModifiers() {
					return [
						{
							getKind() {
								return SyntaxKind.PublicKeyword;
							},
							getText() {
								return "public";
							},
						},
						{
							getKind() {
								return SyntaxKind.StaticKeyword;
							},
							getText() {
								return "static";
							},
						},
						{
							getKind() {
								return SyntaxKind.ReadonlyKeyword;
							},
							getText() {
								return "readonly";
							},
						},
					];
				},
			}),
		),
	).toBe("static readonly");
});
