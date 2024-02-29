#!/bin/bash

target=$(yyyymmdd).json
cat<<EOF>${target}
[
EOF
list=$(ls *.svg *.png)
tail=$(ls *.svg *.png | tail -n 1 ) 
for src in ${list}
do
    name=$(echo ${src} | sed 's%\.[a-z]*%%')
    tablename=$(echo ${src} | sed 's/-.*//')
    datetime=$(echo ${src} | sed 's%.*-%%; s%\.png%%;')
    yyyy=$(echo ${datetime} | sed 's%_.*%%; s%....$%%;')
    mm=$(echo ${datetime} | sed 's%_.*%%; s%..$%%; s%^....%%;')
    if [ "${tail}" = "${src}" ]
    then
	cat<<EOF>>${target}
    {
        "id": "${datetime}",
        "icon": "syntelos-catalog",
        "path": "${tablename}",
        "link": "https://drive.google.com/drive/folders/1r12NAOW-14pcXRNnlGsvUXGCAx42SyAy?usp=drive_link",
	"name": "${name}",
        "embed": "/${tablename}/${yyyy}/${mm}/${src}"
    }
EOF
    else
	cat<<EOF>>${target}
    {
        "id": "${datetime}",
        "icon": "syntelos-catalog",
        "path": "${tablename}",
        "link": "https://drive.google.com/drive/folders/1r12NAOW-14pcXRNnlGsvUXGCAx42SyAy?usp=drive_link",
	"name": "${name}",
        "embed": "/${tablename}/${yyyy}/${mm}/${src}"
    },
EOF

    fi	
done
cat<<EOF>>${target}
]
EOF
