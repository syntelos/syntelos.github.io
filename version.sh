#!/bin/bash

function version_last {
    find $1  -type f -name '*.json' | sort | tail -n 1 | sed 's%.*/%%; s%\.json$%%;'
}

function version_move {
    
    if last=$(version_last $1) &&[ -n "$last" ]&&[ "$2" = "$last" ]
    then
      html_source="${1}/index.html"
      html_target="${1}/index-${2}.html"
      if [ -f ${html_target} ]
      then
      return 1
    else
      cp $html_source $html_target
      git add $html_target
      next=$(date '+%Y%m%d')
      catalog_source=$(find $1  -type f -name '*.json' | sort | tail -n 1 )
      catalog_target=$1/$(date +%Y)/$(date +%m)/${next}.json
      cp $catalog_source $catalog_target
      git add $catalog_target
      echo "Edit ${catalog_target}"
      return 0
    fi
    else
      return 1
    fi
}

if [ -d "$1" ]&&[ -f "${1}/index.html" ]&&[ -f "${1}/index.txt" ]
then
  if [ -n "${2}" ]
  then
    version_move $1 $2
  else
    version_last $1
    fi
else
  cat<<EOF>&2
Synopsis

  $0 <directory> [last]

Description

  Copy <index.html> to version,
  and index.

  Prepare for editing.

EOF
fi
