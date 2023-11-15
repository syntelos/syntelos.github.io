#!/bin/bash

if [ -f index.txt ]
then
    for volume in $(egrep -v '^#' index.txt)
    do
       if 1>/dev/null pushd ${volume}
        then

            if ls | egrep -e '^[0-9][0-9][0-9][0-9]$' | sort -rV > index.txt
            then
                git add index.txt

                for year in $(egrep -v '^#' 'index.txt')
                do

                    if 1>/dev/null pushd ${year} && ls | egrep -e '^[0-9][0-9]$' | sort -rV > index.txt
                    then
                        git add index.txt

                        for month in $(egrep -v '^#' 'index.txt')
                        do

                            if 1>/dev/null pushd ${month} && 2>/dev/null ls *.json | sed 's%\.json%%;' | sort -rV > index.txt
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

       1>/dev/null popd

       wc -l $(find ${volume} -type f -name 'index.txt')

    done
else
    1>&2 cat<<EOF
$0 error: missing 'index.txt' location.
EOF
    exit 1
fi
