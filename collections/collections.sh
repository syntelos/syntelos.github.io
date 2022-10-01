#!/bin/bash

target=collections.json

echo '[' >${target}

for collection in $(./list.sh)
do

    url=$(head -n 1 ${collection}.txt | sed 's%^#%%')
    id=$(echo ${url} | sed 's%.*/%%')
    username=$(echo ${url} | sed 's%.*twitter.com/%%; s%/.*%%;')

    cat <<EOF >>${target}
  {
    "id": "${id}",
    "name": "${collection}",
    "username": "${username}",
    "url": "${url}"
  },
EOF
done

echo ']' >>${target}

git add ${target}
wc -l ${target}
