# Broadcaster
&nbsp;
&nbsp;
&nbsp;

![alt text](https://github.com/The-Clayman/Broadcaster/blob/migrate_frontend_to_react/Broadcaster.png)

&nbsp;
&nbsp;

Broadcaster is a self-contained video streaming application designed to take short video files as input, transcode them, and generate RTSP streams on demand.
Broadcaster was created for running video files as rtsp streams, on demand, for developing and testing video applications. 
&nbsp;

The application consist of 3 containers:
1. rtsp-simple-server: rtsp server container.
2. broadcaster_service : transcoding and straming application service container.
3. broadcaster_front : boardcaster fronend

  *  *  *  *  *
&nbsp;
&nbsp;

## How to build:

Build application images:
```bash
./build_images.sh
```
&nbsp;


## How to run the application:
There are 2 ways to run the application:
&nbsp;

#### 1.Docker compose (recommanded):
  ```bash
  sudo docker-compose up -d
  ```
Appliaction should be available on:
[http://localhost:4200/](http://localhost:4200/)
&nbsp;
&nbsp;
&nbsp;

> **_NOTE:_**
For a distributed deployment (which is still recommended for all deployment scenarios), it is advisable to configure:
>  1. The Broadcaster_service hostname/ip param.
>  2. The Rtsp-simple-server hostname/ip param.
>     &nbsp;
> 
> 1 .Broadcaster_service hostname/ip param: update the `broadcaseterBaseUrl` value in the josn file located at `./Broadcaster_front/src/properties.json`:
> 
>   ```json
>   {
>     "broadcaseterBaseUrl": "http://<broadcaster_service_ip_or_hostname>:5000"
>   }
>  ```
>
> 2. The Rtsp-simple-server hostname/ip param: update the `rtsp_url_address` value in the conif file located at `./Broadcaster_service/config.json`:
>
>  ```json
>{
>  "rtsp_url_address": "rtsp://<rtsp-server ips or host>:8554/",
>}
>  ```

&nbsp;
#### 2.Docekr run commands
1. Run the rtsp-server container:
  ```bash
  sudo docker run -d --rm --name rtsp_server --network=host aler9/rtsp-simple-server`
  ```
2. Run the broadcaster service:
  ```bash
  sudo docker run -d --name broadcaster --network=host broadcaster_service
  ```
3. Run the broadcaseter front:
  ```bash
  sudo docker run -d --name broadcaster -v videos:/home/myuser/code/videos --network=host broadcaster_service_dev
  ```
Appliaction should be available on:
[http://localhost:4200/](http://localhost:4200/)

&nbsp;
  *  *  *  *  *

&nbsp; 
&nbsp;
# API - Dev
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


