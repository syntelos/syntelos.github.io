#!/bin/bash

if object=$(adds | grep '\.json$') &&[ -n "${object}" ]
then
  source="index.html"
  target=index-$(basename $object | sed 's%\.json%.html%')
  cp -p $source $target
  git add $target
  cd ..
  ./index.sh
  git add $(mods)
 else
  echo "$0: error: missing object."
fi
