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

![alt text](https://drive.google.com/uc?id=1TQ2VC0pgMt7adyxpKDeGA5DXSXKU5R2c&export=download)

The application consist of 3 containers:
1. rtsp-simple-server: rtsp server container.
2. broadcaster_service : transcoding and straming application service container.
   - https://hub.docker.com/repository/docker/theclayman/broadcaster_service/
3. broadcaster_front : broadcaster frontend
   - https://hub.docker.com/repository/docker/theclayman/broadcaster_front/
  *  *  *  *  *
&nbsp;
&nbsp;

## How to run the application:
There are 2 ways to run the application: 

1. Docker compose (recommended)
2. Docker run commands.

For both methods, please follow the following prerequisite:
&nbsp;


&nbsp;
&nbsp;
&nbsp;


#### 1.Docker compose (recommanded):
1. Run:
  ```bash
  sudo HOST_IP="<machine_host_or_ip>" docker-compose up -d
  ```
  e.g `sudo HOST_IP="192.168.1.95" docker-compose up -d`
&nbsp;
   >  **_NOTE:_**
   >   Artenitivly, you can replace the 2 accurences of `${HOST_IP}` on you docker file with <machine_host_or_ip>:
   >  1. Edit docker compose file and replace `${HOST_IP}` occurrences (with the dollar sign and curly brackets)
   >     i.e  `- "rtsp_url_address=rtsp://10.0.0.95:8554`
   >  3. Run the docker command as folows:
   >    ```bash
   >      sudo docker-compose up -d
   >    ``` 
   > &nbsp;
   >
> 

Application ui should be available on:
[http://localhost:3000/](http://localhost:3000/)

2. To remove the deployment, run:
  ```bash
  sudo docker-compose down
  ```

&nbsp;
&nbsp;
&nbsp;



&nbsp;
#### 2.Docker run commands

1. Create env param with machine host name or ip:
  ```bash
  export HOST_IP="10.0.0.95"
  ```
  e.g: export `HOST_IP="10.0.0.95"`
  
2. Create docker network:
  ```bash
  sudo docker network create -d bridge broadcaster_network
  ```


3. Run the rtsp-server container:
  ```bash
  sudo docker run -d --rm \
    --name rtsp_server \
    --network=broadcaster_network \
    -p 8554:8554 \
    aler9/rtsp-simple-server
  ```
4. Run the broadcaster service:
   * replace the <machine_host_or_ip> and run:
  ```bash
  sudo docker run -d \
    --name broadcaster_service \
    -v videos:/home/myuser/code/videos \
    -e rtsp_url_address=rtsp://${HOST_IP}:8554/ \
    --network=broadcaster_network \
    -p 5000:5000 \
    theclayman/broadcaster_service
  ```
5. Run the broadcaster front:
  * replace the <machine_host_or_ip> and run:
  ```bash
  sudo docker run -d \
    --name broadcaster_front \
    -e REACT_APP_BASE_URL=http://${HOST_IP}:5000/ \
    --network=broadcaster_network \
    -p 3000:3000 \
    theclayman/broadcaster_front
  ```
Application ui should be available on:
[http://localhost:3000/](http://localhost:3000/)

6. To remove containers and network, run:
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


* See Broadcaster API readme on ./Broadcaster_service/README.md


