#!/usr/bin/env node
declare const pkg: any;
declare const child_process: any;
declare const cwd: string;
declare const path: any;
declare const copydir: any;
declare const fs: any;
declare const targetPackage: any;
declare const targetPackageJson: any;
declare const tempPath: any;
declare function prepWrapper(): Promise<void>;
declare function buildLib(): Promise<void>;
declare function renameLib(): Promise<void>;
declare function cleanUp(): Promise<void>;
declare function buildNodeApp(): Promise<void>;
declare function build(): Promise<void>;
declare function executeTests(): Promise<void>;
declare function main(): Promise<void>;
//# sourceMappingURL=bin.d.ts.map