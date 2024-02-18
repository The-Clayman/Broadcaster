#!/bin/bash

set -e

DIR="$(pwd)"
SECONDS=0

echo "$0 starts, $(date)"
echo ""
echo "about to build boradcaster images"
echo ""
echo "----broadcaster service"

cd Broadcaster_service
./build.sh
echo ""
cd ..

echo "----broadcasetr front"
cd Broadcaster_front
./build_dev.sh
echo ""
cd ..

echo "$0 done, $(date), time elapsed:[$SECONDS]"
echo ""

