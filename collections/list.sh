#!/bin/bash

for index in $(ls *.txt | egrep -ve '(^log-|^index.txt$)')
do
  name=$(basename ${index} .txt)
  echo ${name}
done
