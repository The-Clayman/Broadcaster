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

echo "----broadcasetr frontend"
cd Broadcaster_frontend
./build.sh
echo ""
cd ..

echo "$0 done, $(date), time elapsed:[$SECONDS]"
echo ""


