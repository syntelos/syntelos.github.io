ls *.json | sort -rV | awk -F. '{print $1}'
