#!/bin/bash
cd "$(dirname "$0")/.."
set -e

DIR="$1"
NAME="$2"

if test "x$DIR" = x || test "x$NAME" = x; then
  echo "USAGE: ./scripts/init-submodule.sh testing fi.hg.core" >&2
  exit 1
fi

MODULE_DIR="$DIR/src/$(echo "x$NAME"|sed -re 's/^x//'|tr '.' '/')"

if test -d $MODULE_DIR; then
  echo "ERROR: Module directory exists already: $MODULE_DIR" >&2
  exit 2
fi


set -x
mkdir -p "$(dirname "$MODULE_DIR")"
git submodule add "git@github.com:heusalagroup/$NAME.git" "$MODULE_DIR"
git config -f .gitmodules "submodule.$MODULE_DIR.branch" main
