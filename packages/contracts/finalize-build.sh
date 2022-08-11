#!/usr/bin/env bash

# Creates per-distribution package.json files. These package.json files define the default package type for each build.

cat >build/cjs/package.json <<!EOF
{
	"type": "commonjs"
}
!EOF

cat >build/mjs/package.json <<!EOF
{
	"type": "module"
}
!EOF

cat >build/index.d.ts <<!EOF
export * from "./mjs"
!EOF
