# Broadcaster service
&nbsp;
&nbsp;

## Config file params
The config file `config.json` consists of the following:
```json
{
  "load_on_startup": "True", 
  "rtsp_url_address": "rtsp://localhost:8554/", 
  "rtsp_server_url": "rtsp://rtsp_server:8554/",  
  "ffmpeg_stream_command": "ffmpeg -re -stream_loop -1 -i {VIDEO_DIR}/{video_name}/{ts_file_name} -vcodec copy -an -f rtsp {rtsp_command_url}",
  "ffmpeg_transcode_command": "ffmpeg -y -i {VIDEO_DIR}/{video_name}/{video_file_name} -c copy -an {VIDEO_DIR}/{video_name}/{ts_file_name}"
}
```
&nbsp;

* `load_on_startup`:  should video be loaded from video volume? or should the system startup fresh ignoring video exist on volume.
* `rtsp_url_address`:  rtsp_url is used to compose the rtsp url string sent back to end user, and ideally should contain rtsp-server machine's external ip.
* `rtsp_server_url`:  rtsp_server_url is used for ffmpeg stream command, and should point to the rtsp-simple-server service hostname,
                      defined on the docker-compose file by default (`rtsp://rtsp_server:8554/`).
                      for dev purposes, `rtsp://localhost:8554/` should do.
* `ffmpeg_stream_command`:  ffmpeg stram command, can be altered to a valid ffmpeg command (e.g. add flags for sound off), keep curly brackets params (e.g. `{ts_file_name}`) as it's been resolved upon usage.
* `ffmpeg_transcode_command`:  ffmpeg transcode command, can be altered to a valid ffmpeg command (e.g. add flags for different target resolution), keep curly brackets params (e.g. `{video_file_name}`) as it's been resolved upon usage.

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
