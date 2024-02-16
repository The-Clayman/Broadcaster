#!/bin/bash

sudo docker build -t broadcaster_front  .

# production container run command example:
# sudo docoker run --name broadcaster_front -d -p 80:80 broadcaster_front

