import os
import shutil
import signal
import subprocess
from queue import Queue
from threading import Thread
from time import sleep

import utils

VIDEO_DIR = "videos/warehouse"
UPLOAD_DIR = "videos/upload"
TRANSCODE_TIMEOUT_SEC = 15
ALLOWED_EXTENSIONS = {'txt'}
#TRANSCODE_COMMAND="ffmpeg -i abc.mp4 -c:v libx264 -c:a aac -b:a 160k -bsf:v h264_mp4toannexb -f mpegts -crf 32 pqr.ts"
DEFAULT_FFMPEG_STREAM_COMMAND = "ffmpeg -re -stream_loop -1 -i {VIDEO_DIR}/{video_name}/{ts_file_name} -vcodec copy -an -f rtsp {rtsp_command_url}"
DEFAULT_FFMPEG_TRANSCODE_COMMAND = "ffmpeg -y -i {VIDEO_DIR}/{video_name}/{video_file_name} -c copy -an {VIDEO_DIR}/{video_name}/{ts_file_name}"

# RTSP_SERVER_URL consist of the service hostname defined on the docker-compose file.
# this param will be used for the rtsp stream command
RTSP_SERVER_URL = "rtsp://rtsp_server:8554/"
#short command : ffmpeg -i video1.mp4 -c copy -an video2.ts
# ffmpeg -i video1.mp4 -c copy -an video2.ts

#https://github.com/kkroening/ffmpeg-python/blob/master/examples/README.md#stream-from-a-local-video-to-http-server
#process = ffmpeg.input("video2.ts").output('http://127.0.0.1:8080',codec = "copy",listen=1,f="flv").global_args("-re", "-stream_loop", "-1").run()


class Processor(Thread):

    def __init__(self, logger, queue, dau_service):
        Thread.__init__(self)
        self.logger = logger
        self.dau_service = dau_service
        self.is_running = True
        self.queue = queue

    def process_task(self, task):
        type = task.get("type")
        video_name = task.get("video_name")

        if type == "TRANSCODE":
            self.init_transcode_video(video_name)
        elif type == "RETRANSCODE":
            self.transcode_video(video_name)
        elif type == "PLAY":
            self.play_video(video_name)
        elif type == "STOP":
            self.stop_video(video_name)


    def execute_os_command(self, command, wait):
        split_command = command.split()
        #TODO: redirect the errors to files
        process = subprocess.Popen(split_command, shell=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if wait:
            process.wait(wait)
        return process

    def send_signal_process(self, process, signal, wait):
        process.send_signal(signal)
        if wait:
            process.wait()


    def play_video(self, video_name):
        try:
            ts_file_name = self.dau_service.get_video_prop_value(video_name, 'ts_file_name')
            status = self.dau_service.get_video_status(video_name)
            if status in ['PLAYING']:
                self.logger.warning(f"[{video_name}] status is [{status}], stopping the streams before playing]")
                self.stop_video(video_name)
                status = self.dau_service.get_video_status(video_name)
            if ts_file_name and status and status in ['READY', "FAILED_PLAYING"]:
                rtsp_url_prefix = self.dau_service.config.get('rtsp_url_address')
                rtsp_url = f'{rtsp_url_prefix}{video_name}'
                rtsp_command_url = f'{RTSP_SERVER_URL}{video_name}'
                #default_ffmpeg_config_command = f"ffmpeg -re -stream_loop -1 -i {VIDEO_DIR}/{video_name}/{ts_file_name} -vcodec copy -an -f rtsp {rtsp_url}"
                ffmpeg_stream_command = self.dau_service.config.get("ffmpeg_stream_command")
                ffmpeg_stream_command = ffmpeg_stream_command if ffmpeg_stream_command != None else DEFAULT_FFMPEG_STREAM_COMMAND
                command_string = utils.utils.fstr(ffmpeg_stream_command, locals(), globals=globals())

                # example: ffmpeg -re -stream_loop -1 -i video1.ts -vcodec copy -an -f rtsp rtsp://localhost:8554/mystream
                self.logger.debug(f"rtsp command: [{command_string}]")
                process = self.execute_os_command(command_string, None)
                pid = process.pid
                return_code = process.returncode
                self.dau_service.update_video_prop(video_name, "pid", pid)
                self.dau_service.set_process(video_name, process)
                self.dau_service.update_video_prop(video_name, "rtsp_url", rtsp_url)
                self.dau_service.update_status(video_name, "PLAYING")
                self.logger.info(f"video [{video_name}] playing, [{rtsp_url=}]")
            else:
                self.logger.warning(f"video=[{video_name}][{status=}], is not in the right status to be play")


        except Exception as e:
            self.logger.exception(f"Error in play video=[{video_name}], setting to failed, {e=}")
            if self.dau_service.get_video(video_name):
                self.dau_service.update_status(video_name, "FAILED_PLAYING")


    def stop_video(self, video_name):
        try:
            status = self.dau_service.get_video_status(video_name)
            process = self.dau_service.get_process(video_name)
            if process:
                self.send_signal_process(process, signal.SIGINT, True)
                self.dau_service.update_video_prop(video_name, "pid", None)
                self.dau_service.delete_process(video_name)
                self.dau_service.update_video_prop(video_name, "rtsp_url", None)
                self.dau_service.update_status(video_name, "READY")
                self.logger.info(f"video [{video_name}] Stopped")

        except Exception as e:
            self.logger.exception(f"Error in stoping video=[{video_name}], setting to failed, {e=}")
            if self.dau_service.get_video(video_name):
                self.dau_service.update_status(video_name, "FAILED_STOPPED")

    def init_transcode_video(self, video_name):
        try:
            video_file_name = self.dau_service.get_video_file_name(video_name)
            status = self.dau_service.get_video_status(video_name)

            if status and status in ['REGISTERED']:

                shutil.rmtree(f"{VIDEO_DIR}/{video_name}", True)
                os.mkdir(f"{VIDEO_DIR}/{video_name}")
                shutil.move(f"{UPLOAD_DIR}/{video_file_name}", f"{VIDEO_DIR}/{video_name}/")
                self.transcode_video(video_name)
        except Exception as e:
            self.logger.exception(f"Error in transcoding video=[{video_file_name}], setting to failed, {e=}")
            if self.dau_service.get_video(video_file_name):
                self.dau_service.update_status(video_file_name, "FAILED_TRANSCODING")

    def transcode_video(self, video_name):
        try:
            if self.dau_service.get_video(video_name):
                video_file_name = self.dau_service.get_video_file_name(video_name)
                status = self.dau_service.get_video_status(video_name)
                if video_file_name and status and status in ['REGISTERED', 'FAILED_TRANSCODING', 'READY']:
                    self.dau_service.update_status(video_name,"PROCESSING")
                    #ffmpeg.input(f"{VIDEO_DIR}/{file_name}/{video_file_name}").codec(copy)

                    ts_file_name = f'{video_name}.ts'
                    #command = ['ffmpeg', '-i', f'{VIDEO_DIR}/{video_name}/{filename}','-c', 'copy',  '-an' ,f'{VIDEO_DIR}/{video_name}/{ts_file_name}']
                    ffmpeg_transcode_command = self.dau_service.config.get("ffmpeg_transcode_command")
                    ffmpeg_transcode_command = ffmpeg_transcode_command if ffmpeg_transcode_command != None else DEFAULT_FFMPEG_TRANSCODE_COMMAND

                    self.logger.info(f"Transcoding, Going to run [{ffmpeg_transcode_command}]")
                    #process = subprocess.Popen(command, shell=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                    #process.wait()
                    command_string = utils.utils.fstr(ffmpeg_transcode_command, locals(), globals=globals())
                    process = self.execute_os_command(command_string, TRANSCODE_TIMEOUT_SEC)
                    return_code = process.returncode
                    self.logger.info(f"[{video_name}] transcoding done , [{return_code=}]")
                    if return_code == 0:
                        self.dau_service.update_status(video_name, "READY")
                        self.dau_service.update_video_prop(video_name, "ts_file_name", ts_file_name)
                    else:
                        self.logger.error(f"[{video_name}] Error in transcoding, [{return_code=}]")
                        self.dau_service.update_status(video_name, "FAILED_TRANSCODING")
                else:
                    self.logger.error(f"transcoding skipped, one of the preconditions weren't met, [{video_name=}] ,[{status=}], [{video_file_name=}]")
        except Exception as e:
            self.logger.exception(f"Error in transcoding video=[{video_file_name}], setting to failed, {e=}")
            if self.dau_service.get_video(video_file_name):
                self.dau_service.update_status(video_file_name, "FAILED_TRANSCODING")

                

    def run(self):
        task = None
        while self.is_running:
            try:
                task = self.queue.get(timeout=1)
                if task:
                    self.process_task(task)

                sleep(0.1)

            except Exception:
                task = None
            #except Exception as e:
             #   self.logger.exception(f"Error in get task {e=}")

        self.logger.info(f'Processor done')


    def get_base_name(self, filename):
        return os.path.splitext(filename)[0]

