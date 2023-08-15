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
    path.resolve(__dirname, "..", "go-wrapper"),
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

async function renameApp() {
  fs.renameSync(
    path.resolve(tempPath, "nodeapp"),
    path.resolve(tempPath, `${targetPackageJson.name}`)
  );
}

async function renameLib() {
  fs.renameSync(
    path.resolve(tempPath, "nodeapp"),
    path.resolve(tempPath, `${targetPackageJson.name}`)
  );

  fs.renameSync(
    path.resolve(tempPath, "lib.so"),
    path.resolve(tempPath, `${targetPackageJson.name}.so`)
  );

  fs.renameSync(
    path.resolve(tempPath, "lib.h"),
    path.resolve(tempPath, `${targetPackageJson.name}.h`)
  );
}

async function cleanUp() {
  fs.renameSync(
    path.resolve(tempPath, "go-wrapper", "nodeapp"),
    path.resolve(tempPath, "nodeapp")
  );
  fs.rmSync(path.resolve(tempPath, "go-wrapper"), {
    recursive: true,
    force: true,
  });
}

async function buildNodeApp(path: string) {
  await pkg.exec([
    `${cwd}/${targetPackageJson.main}`,
    "--compress",
    "GZip",
    "--target",
    "node18-linux-arm64,node18-win-arm64,node18-macos-arm64,node18-macos-x64,node18-win-x64,node18-linux-x64",
    "--output",
    path,
  ]);
}

async function build() {
  console.log("building cgi module");
  await buildNodeApp(path.resolve(tempPath, `${targetPackageJson.name}`));
}

async function buildDll() {
  await prepWrapper();
  console.log("building dllify module");
  await buildNodeApp(path.resolve(tempPath, "go-wrapper", "nodeapp"));
  console.log("wrapping node app");
  await buildLib();
  await cleanUp();
  await renameLib();
}

async function executeTests() {
  await build();
  fs.copyFileSync(
    path.resolve(__dirname, "test.py"),
    path.resolve(tempPath, "test.py")
  );
  child_process.execSync(`cd  ${path.resolve(tempPath)} && python test.py`, {
    cwd: cwd,
    stdio: "inherit",
  });
}

async function main() {
  const command = process.argv[2];
  if (command === "build") {
    await build();
  } else if (command === "test") {
    await executeTests();
  }
}

main();
