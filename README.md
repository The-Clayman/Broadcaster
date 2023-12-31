# Broadcaster
&nbsp;
&nbsp;


Broadcaster is a self-contained video streaming application designed to take short video files as input, transcode them, and generate RTSP streams on demand.
Broadcaster was created for running video files as rtsp streams, on demand, for developing and testing video applications. 
&nbsp;

The application consist of 2 containers:
1. rtsp-simple-server: rtsp server container.
2. broadcaster: transcoding and straming application service container.

  *  *  *  *  *
&nbsp;

### How to build:
Run:
```bash
./build.sh
```
&nbsp;


### How to run the applicatoin:
1. Run the rtsp-server container:
  ```bash
  sudo docker run -d --rm --name rtsp_server --network=host aler9/rtsp-simple-server`
  ```
2. Run the broadcaster service:
  ```bash
  sudo docker run -d --name broadcaster --network=host broadcaster_service
  ```
&nbsp;
  *  *  *  *  *
 &nbsp; 
# API
&nbsp;
&nbsp;
### Get all videos details
url:
  ```bash
  GET http://127.0.0.1:5000/broadcaster/v1/videos
  ```
&nbsp;

### Get a video detail
url:
  ```bash
  GET http://127.0.0.1:5000/broadcaster/v1/videos/<video_name>
  ```
&nbsp;

### Add video
url:
  ```bash
  POST http://127.0.0.1:5000/broadcaster/v1/videos
  ```
body:
  ```json
file=<video_file_name>.mp4
  ```
&nbsp;

### Delete video
url:
  ```bash
  DELETE http://127.0.0.1:5000/broadcaster/v1/videos/<video_name>
  ```
&nbsp;

### Retrascode video
url:
  ```bash
  POST http://127.0.0.1:5000/broadcaster/v1/player/<video_name>/retranscode
  ```
&nbsp;

### Play video
url:
  ```bash
  POST http://127.0.0.1:5000/broadcaster/v1/player/<video_name>/play
  ```
&nbsp;

### Stop video
url:
  ```bash
  POST http://127.0.0.1:5000/broadcaster/v1/player/<video_name>/stop
  ```


