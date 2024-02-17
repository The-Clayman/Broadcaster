# Broadcaster
&nbsp;
&nbsp;
&nbsp;

![alt text](https://drive.google.com/uc?id=1cGlHIU_E1iPjOlrf99KmsZD3u47JMrrO&export=download)

&nbsp;
&nbsp;

Broadcaster is a self-contained video streaming application designed to take short video files as input, transcode them, and generate RTSP streams on demand.
Broadcaster was created for running video files as rtsp streams, on demand, for developing and testing video applications. 
&nbsp;

The application consist of 3 containers:
1. rtsp-simple-server: rtsp server container.
2. broadcaster_service : transcoding and straming application service container.
   - https://hub.docker.com/repository/docker/theclayman/broadcaster_service/general
3. broadcaster_front : boardcaster fronend
   - https://hub.docker.com/repository/docker/theclayman/broadcaster_front/general
  *  *  *  *  *
&nbsp;
&nbsp;

## How to run the application:
There are 2 ways to run the application: 

1. Docker compose (recommanded)
2. Docker run commands.

For both method, plase follow the following prerequisite:
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
>     "broadcaseterBaseUrl": "http://<broadcaster_service_ip_or_hostname>:5000/"
>   }
>  ```
>
> 2. The Rtsp-simple-server hostname/ip param: update the `rtsp_url_address` value in the conif file located at `./Broadcaster_service/config.json`:
>
>  ```json
>  {
>    "rtsp_url_address": "rtsp://<rtsp-server ips or host>:8554/",
>  }
>  ```
&nbsp;
&nbsp;
&nbsp;


#### 1.Docker compose (recommanded):
1. Run:
  ```bash
  sudo docker-compose up -d
  ```
Appliaction ui should be available on:
[http://localhost:3000/](http://localhost:3000/)

2. To remove the deployment, run:
  ```bash
  sudo docker-compose down
  ```

&nbsp;
&nbsp;
&nbsp;



&nbsp;
#### 2.Docekr run commands

1. Create docker network:
  ```bash
  sudo docker network create -d bridge broadcaster_network
  ```


2. Run the rtsp-server container:
  ```bash
  sudo docker run -d --rm \
    --name rtsp_server \
    --network=broadcaster_network \
    -p 8554:8554 \
    aler9/rtsp-simple-server
  ```
3. Run the broadcaster service:
  ```bash
  sudo docker run -d \
    --name broadcaster_service \
    -v videos:/home/myuser/code/videos \
    -v $(pwd)/Broadcaster_service/config.json:/home/myuser/code/config.json \
    --network=broadcaster_network \
    -p 5000:5000 \
    theclayman/broadcaster_service
  ```
4. Run the broadcaseter front:
  ```bash
  sudo docker run -d \
    --name broadcaster_front \
    -v $(pwd)/Broadcaster_front/src/properties.json:/app/src/properties.json \
    --network=broadcaster_network \
    -p 3000:3000 \
    theclayman/broadcaster_front
  ```
Appliaction ui should be available on:
[http://localhost:3000/](http://localhost:3000/)

5. To remove containers and network, run:
  ```bash
  sudo docker network rm broadcaster_network
  ```
  ```bash
  sudo docker rm -f broadcaster_front broadcaster_service rtsp_server
  ```

&nbsp;
  *  *  *  *  *

# Dev

## How to build - Dev:

Build application images:
```bash
./build_images.sh
```

&nbsp; 
&nbsp;
## API - Dev
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


