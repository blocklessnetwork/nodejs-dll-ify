# blockless dllify

dllify your nodejs application. package it for portable use with other languages. Ship your NodeJS app as a complete ready to execute Native Extension, designed with `The Blockless Network` in mind.

# turn nodejs app into a c compatible DLL

technologies

- pkg (node 18) from vercel https://github.com/vercel/pkg
- node golang IPC from https://github.com/zealic/go2node
- golang 1.18
- python 3.9.12

# usage

add this module to your `NodeJS` project.

```bash
yarn add @blocklessnetwork/nodejs-dll
```

add the build script to your package.json

```json
{
  "scripts": {
    "build": "yarn dllify"
  }
}
```

# considerations

the utility of this project is to enable rapid ecosystem enhancement of `the blockless` network. We image over time that the maturity of the JavaScript tools (deno / bun) will continue and the performance of this paradigm will improve.

- final builds can be large uncompressed (80mb)
- compressed files are around 20mb
- a full instance of nodejs and the javascript snapshot are started with each C call
