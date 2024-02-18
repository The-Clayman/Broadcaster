# Braodcster service

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
