#!/bin/bash


function timestamp {

    if [ -n "${1}" ]&& ts=$(date '+%Y%m%d_%H%M' -d "${1}" ) && [ -n "${ts}" ]
    then
        echo "${ts}"

        return 0
    else
        return 1
    fi
}

function target {

    if file=$(egrep ${id} ${collection}/*.html | sed 's/:.*//') && [ -n "${file}" ] &&
            target_id=$(basename "${file}" .html) && [ -n "${target_id}" ]
    then
        echo "${target_id}"
        return 0

    else
        if created=$(twurl user get "${source_date}" valueof 'created_at') &&
           timecode=$(timestamp ${created})
        then
            echo "${user}-${timecode}"
            return 0
        else
            return 1
        fi
    fi
}


for collection in $(./list.sh)
do
    index="${collection}.txt"

    if [ ! -d ${collection} ]
    then
        mkdir ${collection}
    fi

    for reference in $(egrep -v '^#' "${index}")
    do
        user=$(echo ${reference} | sed 's%.*twitter.com/%%; s%/status/.*%%')
        id=$(echo ${reference} | sed 's%.*/status/%%')

        source_date="https://api.twitter.com/2/tweets/${id}?tweet.fields=created_at"

        source_html="https://publish.twitter.com/oembed?url=$(urlencode ${reference})&maxwidth=500&maxheight=500&omit_script=1"

        if target_id=$(target) && [ -n "${target_id}" ]
        then
            target_file="${collection}/${target_id}.html"

            if [ ! -f "${target_file}" ]
            then

                if twurl user get "${source_html}" valueof 'html' > "${target_file}"
                then
                    git add "${target_file}"

                    echo "U ${target_file}"
                else
                    echo "$0 error from 'twurl user get ${source_html} valueof html > ${target_file}'."

                    exit 1
                fi
            fi

        else
            echo "$0 error from 'twurl user get ${source_date} valueof created_at'."

            exit 1
        fi
    done
done
