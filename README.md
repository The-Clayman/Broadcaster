# Broadcaster

Broadcaster is a self-contained video streaming application designed to take short video files as input, transcode them, and generate RTSP streams on demand.
Broadcaster was created for running video files as rtsp streams, on demand, for developing and testing video applications. 

The application consist of 2 containers:
1. rtsp-simple-server: rtsp server container.
2. broadcaster: transcoding and straming application service container.

  *  *  *  *  *


### How to build:
Run:
```bash
./build.sh
```


### How to run the applicatoin:
1. Run the rtsp-server container:
  ```bash
  sudo docker run -d --rm --name rtsp_server --network=host aler9/rtsp-simple-server`
  ```
2. Run the broadcaster service:
  ```bash
  sudo docker run -d --name broadcaster --network=host broadcaster_service
  ```
