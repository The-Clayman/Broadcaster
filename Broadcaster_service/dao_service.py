import glob
import json
import os
import shutil
from os.path import exists

import utils
from processor import VIDEO_DIR

class DaoService:

    def __init__(self, logger):
        self.logger = logger
        self.videos = dict()
        self.process = dict()
        self.config = None
        self.init_dau()

    def init_dau(self):
        try:
            with open('config.json', 'r') as f:
                self.config = json.load(f)

            do_load = False if self.config.get('load_on_startup') and self.config.get('load_on_startup').lower() == 'false' else True
            if do_load:
                self.load()
        except Exception as e:
            self.logger.error(f"error occur on init dau {e=}")
            if not self.config:
                self.config = dict()

    def get_video(self, video_key):
        res = None
        if video_key:
            res = self.videos.get(video_key)
        else:
            res = self.videos
        return res

    def get_video_status(self, video_key):
        status = ""
        video = self.get_video(video_key)
        if video:
            status = video.get('status')
        else:
            raise Exception(f"get_video_status, [{video_key=}] not found")
        return status

    def get_video_prop_value(self, video_key, prop_key):
        file_name = ""
        video = self.get_video(video_key)
        if video:
            file_name = video.get(prop_key)
        else:
            raise Exception(f"get_video_status, [{video_key=}] not found")
        return file_name

    def set_process(self, video_key, process):
        self.process[video_key] = process

    def get_process(self, video_key):
        return self.process.get(video_key)

    def delete_process(self, video_key):
        return self.process.pop(video_key)

    def get_video_file_name(self, video_key):
        file_name = ""
        video = self.get_video(video_key)
        if video:
            file_name = video.get('file_name')
        else:
            raise Exception(f"get_video_status, [{video_key=}] not found")
        return file_name

    def update_video_prop(self, video_key, prop_name, value):
        video = self.get_video(video_key)
        if video:
            video[prop_name] = value

    def add_new_video(self, file_name):
        video_name = utils.utils.get_base_name(file_name)
        return_code = 200
        message = f"video [{video_name}] added"
        video = None
        if not self.videos.get(video_name):
            video = dict()
            video['status'] = "REGISTERED"
            video['file_name'] = file_name
            self.videos[video_name] = video
        else:
            self.logger.info(f"add_new_video, duplicate key [{video_name}] found")
            return_code = 409
            message = f"video [{video_name}] already exist"
        return video_name, video, message, return_code

    def update_status(self, video, new_status):
        res = True
        if self.videos[video]:
            prev_status = self.videos.get(video).get('status')
            self.videos[video]['status'] = new_status
            self.logger.info(f"************[{video}] status change [{prev_status=}], [{new_status=}]")
        else:
            self.logger.error(f"Update video [{video}] status to [{new_status}] failed, video not found")
            res = False
        return res

    def delete_video(self, video_name):
        video_meta = self.videos.pop(video_name)
        if video_meta:
            # going to delete warehouse files
            shutil.rmtree(f"{VIDEO_DIR}/{video_name}", True)
            self.logger.info(f"video [{video_name}] deleted from filesystem")
        else:
            self.logger.error(f"dau delete_video, video [{video_name}] could not be found")

    def load(self):

        videos = next(os.walk(f"{VIDEO_DIR}/"))[1]
        self.logger.info(f"os video under: [{VIDEO_DIR}], videos=[{videos}]")
        for video_name in videos:
            try:
                ts_file_name = f"{video_name}.ts"
                # try to discover the original video file name and extension
                dir_file_names = glob.glob(f"{VIDEO_DIR}/{video_name}/{video_name}.*")
                filtered_dir_file_names = [file_name for file_name in dir_file_names if ".ts" not in file_name]
                video_file_path_name = filtered_dir_file_names[0] if len(filtered_dir_file_names) == 1 and video_name in dir_file_names[0] else None
                if video_file_path_name:
                    video_file_name = utils.utils.get_filename_from_path(video_file_path_name)
                    if exists(f"{VIDEO_DIR}/{video_name}/{video_file_name}") \
                            and exists(f"{VIDEO_DIR}/{video_name}/{ts_file_name}"):
                        video_name, video, message, return_code = self.add_new_video(video_file_name)
                        if return_code == 200:
                            self.update_status(video_name, "READY")
                            self.update_video_prop(video_name, "ts_file_name", ts_file_name)
            except Exception as e:
                self.logger.exception(f"error on load on [{video_name}], skipping {e=}")

        self.logger.info(f"Done loading video from disk, loaded videos = {self.videos.keys()}")

