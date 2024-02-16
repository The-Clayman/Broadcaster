#!/bin/bash

# this script will download publicly available samples video for broadcaster testing.
# source: https://gist.github.com/jsturgis/3b19447b304616f18657

#input="$(realpath $1)"
input="$(realpath ./video_samples.csv)"


while IFS="" read -r p || [ -n "$p" ]
do
  wget $p
done < $input
