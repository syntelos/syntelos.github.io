#!/bin/bash

pn=$0
wd=$(dirname $0)

function usage {
    cat<<EOF>&2
Synopsis

  ${0} <object> [last|next|list|increment]

Description

  Translate and transform journal structure of <object>.

    last

      ${pn} gegonen last

      Report last catalog state of journal "gegonen".

    next

      ${pn} gegonen next

      Report next catalog state of journal "gegonen".

    list

      ${pn} gegonen list

      Enumerate catalog state of journal "gegonen".

    increment

      ${pn} gegonen increment

      Increment catalog and html state of journal "gegonen"
      from last to next, if possible.

EOF
}

function next {

    if [ -d "${object}" ]&&[ -f "${object}/index.html" ]
    then
	if catalog_next="${object}/$(yyyy)/$(mm)/$(yyyymmdd).json" && [ -n "${catalog_next}" ]
	then
	    echo ${catalog_next}
	    if [ -f "${catalog_next}" ]
	    then
		1>&2 cat -n ${catalog_next}
	    fi
	    return 0
	else
	    return 1
	fi
    else
	1>&2 echo "${pn} error object '${object}' not found."
	return 1
    fi
}

function last {

    if [ -d "${object}" ]&&[ -f "${object}/index.html" ]
    then
	if catalog_last=$(find "${object}" -type f -name '*.json' | egrep '/[0-9][0-9][0-9][0-9]/[0-9][0-9]/[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9].json' | sort -u | tail -n 2 | head -n 1) && [ -n "${catalog_last}" ]
	then
	    echo ${catalog_last}
	    if [ -f "${catalog_last}" ]
	    then
		1>&2 cat -n ${catalog_last}

		return 0
	    else
		return 1
	    fi
	else
	    return 1
	fi
    else
	1>&2 echo "${pn} error object '${object}' not found."
	return 1
    fi
}

function list {

    if [ -d "${object}" ]&&[ -f "${object}/index.html" ]
    then
	for catalog in $(find "${object}" -type f -name '*.json' | egrep '/[0-9][0-9][0-9][0-9]/[0-9][0-9]/[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9].json' | sort -u)
	do
	    echo ${catalog}
	    1>&2 cat -n ${catalog}
	done
	return 0
    else
	1>&2 echo "${pn} error object '${object}' not found."
	return 1
    fi
}

function increment {
    set -x
    if [ -d "${object}" ]&&[ -f "${object}/index.html" ] &&
       catalog_last=$(last) && catalog_next=$(next) && ${catalog_last} != ${catalog_next}
    then
	object_last=$(basename ${catalog_last} .json)
	year_last=$(echo ${object_last} | sed 's%....$%%')
	month_last=$(echo ${object_last} | sed 's%..$%%; s%^....%%;')

	object_next=$(basename ${catalog_next} .json)
	year_next=$(echo ${object_next} | sed 's%....$%%')
	month_next=$(echo ${object_next} | sed 's%..$%%; s%^....%%;')

	if cat ${catalog_last} | sed "s%${object_last}%${object_next}%g; s%${year_last}%${year_next}%g; s%${month_last}%${month_next}%g;" > ${catalog_next}
	then
	    echo ${catalog_next}
	    cat -n ${catalog_next}
	    git add ${catalog_next}

	    source=${object}/index.html
	    target=${object}/${object}-${object_last}.html

	    if cp ${source} ${target}
	    then
		git add ${target}

		yeday=$(egrep '<h6 class="title">' ${source} | sed 's%.*<h6 class="title">%%; s%</h6>%%;')

		today=$(date '+%A, %e %B %Y')

		if cat ${source} | sed "s%${yeday}%${today}%" > /tmp/tmp
		then
		    cp /tmp/tmp ${source}

		    git status --porcelain

		    return 0
		else
		    2>&1 echo "${pn} error updating html date."
		    return 1
		fi
	    else
		2>&1 echo "${pn} error incrementing html state."
		return 1
	    fi
	else
	    2>&1 echo "${pn} error incrementing catalog state."
	    return 1
	fi
    else
	2>&1 echo "${pn} error state next is present."
	return 1
    fi
}
#
#
if [ -n "${1}" ]&&[ -n "${2}" ]
then
    object=${1}
    shift
    operator="${1}"
    shift
    if ${operator} ${object} $*
    then
	exit 0
    else
	exit 1
    fi
else
    usage
    exit 1
fi
