#!/bin/bash

if 2>/dev/null tgtd=recent/$(yyyy)/$(mm) && 2>/dev/null tgtf=${tgtd}/$(yyyymmdd).json
then
    #
    if [ ! -d "${tgtd}" ]
    then
	mkdir -p "${tgtd}"
    fi
    #
    # N.B. [TODO/REVIEW] Evolution of "recent" into "go-wwweb".
    #
    if wwweb recent gdr jsw "${tgtf}"
    then
	git add "${tgtf}"
	./index.sh
    else
	1>&2 echo "$0: error from 'recent gdr jsw ${tgtf}'."
	exit 1
    fi
else
    1>&2 echo "$0: error from 'tgtf=recent/$(yyyy)/$(mm)/$(yyyymmdd).json'."
    exit 1
fi
