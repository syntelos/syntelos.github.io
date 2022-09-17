#!/bin/bash

function yyyy {
    date +%Y
    return 0
}
function mm {
    date +%m
    return 0
}

for collection in $(./list.sh)
do
    index=${collection}.txt
    target=$(yyyy)/$(mm)/${collection}.html

    cat<<EOF >${target}
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/MarkUp/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
 <head>
  <title>collections/2022/09/${collection}</title>
  <link rel="icon" href="/images/twitter.svg" />
  <style type="text/css">
    body {
        background-color: #ffffff00;
        margin: 0;
        padding: 0;
        font-family: verdana, helvetica, sans-serif;
    }
  </style>
 </head>
 <body>

EOF

    for reference in $(egrep -v '^#' ${index} | head -n 3)
    do
        if html_file=$(egrep "${reference}" ${collection}/*.html | awk -F: '{print $1}') && [ -n "${html_file}" ] &&
           rid=$(echo ${html_file} | sed "s%${collection}/%%; s%\.html$%%;") && [ -n "${rid}" ]
        then

            cat ${html_file} | sed 's%^%    %;' >>${target}

            break
        fi
    done
    cat<<EOF >>${target}

   <script async src="https://platform.twitter.com/widgets.js"></script>
 </body>
</html>
EOF

    echo "U ${target}"
done
