#!/usr/bin/env bash
echo "auto-install-peers=true" > .npmrc 
echo "node-linker=pnp" >> .npmrc
echo "symlink=false" >> .npmrc
npm i --location=global npm 
npm i --location=global pnpm 
pnpm i 
pnpm fetch --prod 
pnpm install -r --offline --prod 
pnpm build
rm -rf node_modules
node serve index.js
