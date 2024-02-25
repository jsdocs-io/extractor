import { expect, test } from "vitest";
import {
  FsError,
  InstallPackageError,
  PackageDeclarationsError,
  PackageJsonError,
  PackageNameError,
  PackageTypesError,
  ProjectError,
} from "./errors";

test("fs error", () => {
  expect(() => {
    throw new FsError("test");
  }).toThrow();
});

test("install package error", () => {
  expect(() => {
    throw new InstallPackageError("test");
  }).toThrow();
});

test("package name error", () => {
  expect(() => {
    throw new PackageNameError("test");
  }).toThrow();
});

test("package json error", () => {
  expect(() => {
    throw new PackageJsonError("test");
  }).toThrow();
});

test("package types error", () => {
  expect(() => {
    throw new PackageTypesError("test");
  }).toThrow();
});

test("package declarations error", () => {
  expect(() => {
    throw new PackageDeclarationsError("test");
  }).toThrow();
});

test("project error", () => {
  expect(() => {
    throw new ProjectError("test");
  }).toThrow();
});
