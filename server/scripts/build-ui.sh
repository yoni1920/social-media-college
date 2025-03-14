#!/usr/bin/env bash

cd ../ui && npm run build

mkdir ../server/ui
mv -v ./dist/* ../server/ui/