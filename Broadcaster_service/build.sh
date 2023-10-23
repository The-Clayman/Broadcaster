sudo docker build -t broadcaster_service .

# Container run command example:
# 1. RTSP server container command example:
#sudo docker run -d --rm --name rtsp_server --network=host aler9/rtsp-simple-server

# 2. Run Broadcaster application container:
# sudo docker run -d --name broadcaster --network=host broadcaster_service

