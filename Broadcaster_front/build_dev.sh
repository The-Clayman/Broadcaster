#!/bin/bash

sudo docker build -f Dockerfile.dev -t broadcaster_front  .

# Dev container run command example:
#sudo docoker run --name broadcaster_front -d -p 3000:3000 broadcaster_front

