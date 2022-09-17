#!/bin/bash


for file in $(egrep 'blockquote.*twitter-tweet' $(find . -type f -name '*.html' ) | sed 's/:.*//' | sort -u )
do
  cat ${file} | sed 's%<blockquote class="twitter-tweet">%<blockquote class="twitter-tweet"  data-lang="en" data-width="500" data-height="500" data-chrome="transparent">%; s%<blockquote class="twitter-tweet" data-width="500">%<blockquote class="twitter-tweet"  data-lang="en" data-width="500" data-height="500" data-chrome="transparent">%;  s%<blockquote class="twitter-tweet" data-partner="TweetDeck">%<blockquote class="twitter-tweet"  data-lang="en" data-width="500" data-height="500" data-chrome="transparent">%' > /tmp/tmp

  if [ -n "$(diff /tmp/tmp ${file} )" ]
  then
      cp /tmp/tmp ${file}
      echo ${file}
  fi
done
