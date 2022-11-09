#!/usr/bin/env node
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
} catch (e) {}

async function prepWrapper() {
  copydir.sync(
    path.resolve(__dirname, "go-wrapper"),
    path.resolve(tempPath, "go-wrapper")
  );
}

async function buildLib() {
  child_process.execSync(
    `cd  ${path.resolve(
      tempPath,
      "go-wrapper"
    )} && go build -buildmode=c-shared -o ../lib.so`,
    {
      cwd: cwd,
    }
  );
}

async function cleanUp() {
  fs.rmSync(path.resolve(tempPath, "go-wrapper"), {
    recursive: true,
    force: true,
  });
}

async function buildNodeApp() {
  await pkg.exec([
    `${cwd}/${targetPackageJson.main}`,
    "--compress",
    "GZip",
    "--target",
    "host",
    "--output",
    path.resolve(tempPath, "go-wrapper", "nodeapp"),
  ]);
}

async function build() {
  await prepWrapper();
  console.log("building dllify module");
  await buildNodeApp();
  console.log("wrapping node app");
  await buildLib();
  await cleanUp();
}

async function executeTests() {
  build();
  fs.copyFileSync(
    path.resolve(__dirname, "test.py"),
    path.resolve(tempPath, "test.py")
  );
  child_process.execSync(`cd  ${path.resolve(tempPath)} && python test.py`, {
    cwd: cwd,
  });
}

async function main() {
  const command = process.argv[2];
  if (command === "build") {
    build();
  } else if (command === "test") {
    executeTests();
  }
}

main();
