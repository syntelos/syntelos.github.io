#!/bin/bash

if [ 'recent' == "$(basename $(pwd))" ]
then

    if ls | egrep -e '^[0-9][0-9][0-9][0-9]$' | sort -rV > index.txt
    then
        git add index.txt

        for year in $(egrep -v '^#' 'index.txt')
        do

            if 1>/dev/null pushd $year && ls | egrep -e '^[0-9][0-9]$' | sort -rV > index.txt
            then
                git add index.txt

                for month in $(egrep -v '^#' 'index.txt')
                do

                    if 1>/dev/null pushd ${month} && ls *.json | sed 's%\.json%%;' | sort -rV > index.txt
                    then
                        git add index.txt

                    else
                        1>&2 cat<<EOF
$0 error: failed to overwrite 'recent/${year}/${month}/index.txt'.
EOF
                        exit 1
                    fi

                    1>/dev/null popd

                done

            else
                1>&2 cat<<EOF
$0 error: failed to overwrite 'recent/${year}/index.txt'.
EOF
                exit 1
            fi

            1>/dev/null popd

        done

        wc -l $(find . -type f -name 'index.txt')

    else
        1>&2 cat<<EOF
$0 error: failed to overwrite 'recent/index.txt'.
EOF
        exit 1
    fi
else
    1>&2 cat<<EOF
$0 error: directory location.
EOF
    exit 1
fi
