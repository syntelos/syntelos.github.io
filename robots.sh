#!/bin/bash

tgt=robots.txt
if [ -f ${tgt} ]
then
  cat<<EOF>${tgt}
user-agent: *
EOF
  find . -type f -name index.html | sed 's/^\./allow: /' >>${tgt}
  exit 0
else
  1>&2 echo "$0 error target 'robots.txt' not found."
  exit 1
fi
