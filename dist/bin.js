#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const pkg = require("pkg");
const child_process = require("child_process");
const cwd = process.cwd();
const path = require("path");
const copydir = require("copy-dir");
const fs = require("fs");
// for the build
const targetPackage = path.resolve(cwd, "package.json");
const targetPackageJson = require(targetPackage);
const tempPath = path.resolve(cwd, "build");
targetPackageJson.name = targetPackageJson.name || "lib";
try {
    if (fs.existsSync(tempPath)) {
        fs.rmSync(tempPath, { recursive: true, force: true });
    }
    fs.mkdirSync(tempPath);
}
catch (e) { }
function prepWrapper() {
    return __awaiter(this, void 0, void 0, function* () {
        copydir.sync(path.resolve(__dirname, "..", "go-wrapper"), path.resolve(tempPath, "go-wrapper"));
    });
}
function buildLib() {
    return __awaiter(this, void 0, void 0, function* () {
        child_process.execSync(`cd  ${path.resolve(tempPath, "go-wrapper")} && go build -buildmode=c-shared -o ../lib.so`, {
            cwd: cwd,
        });
    });
}
function renameApp() {
    return __awaiter(this, void 0, void 0, function* () {
        fs.renameSync(path.resolve(tempPath, "nodeapp"), path.resolve(tempPath, `${targetPackageJson.name}`));
    });
}
function renameLib() {
    return __awaiter(this, void 0, void 0, function* () {
        fs.renameSync(path.resolve(tempPath, "nodeapp"), path.resolve(tempPath, `${targetPackageJson.name}`));
        fs.renameSync(path.resolve(tempPath, "lib.so"), path.resolve(tempPath, `${targetPackageJson.name}.so`));
        fs.renameSync(path.resolve(tempPath, "lib.h"), path.resolve(tempPath, `${targetPackageJson.name}.h`));
    });
}
function cleanUp() {
    return __awaiter(this, void 0, void 0, function* () {
        fs.renameSync(path.resolve(tempPath, "go-wrapper", "nodeapp"), path.resolve(tempPath, "nodeapp"));
        fs.rmSync(path.resolve(tempPath, "go-wrapper"), {
            recursive: true,
            force: true,
        });
    });
}
function buildNodeApp(path) {
    return __awaiter(this, void 0, void 0, function* () {
        yield pkg.exec([
            `${cwd}/${targetPackageJson.main}`,
            "--compress",
            "GZip",
            "--target",
            "node18-linux-arm64,node18-win-arm64,node18-macos-arm64,node18-macos-x64,node18-win-x64,node18-linux-x64",
            "--output",
            path,
        ]);
    });
}
function build() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("building cgi module");
        yield buildNodeApp(path.resolve(tempPath, `${targetPackageJson.name}`));
    });
}
function buildDll() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prepWrapper();
        console.log("building dllify module");
        yield buildNodeApp(path.resolve(tempPath, "go-wrapper", "nodeapp"));
        console.log("wrapping node app");
        yield buildLib();
        yield cleanUp();
        yield renameLib();
    });
}
function executeTests() {
    return __awaiter(this, void 0, void 0, function* () {
        yield build();
        fs.copyFileSync(path.resolve(__dirname, "test.py"), path.resolve(tempPath, "test.py"));
        child_process.execSync(`cd  ${path.resolve(tempPath)} && python test.py`, {
            cwd: cwd,
            stdio: "inherit",
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const command = process.argv[2];
        if (command === "build") {
            yield build();
        }
        else if (command === "test") {
            yield executeTests();
        }
    });
}
main();
