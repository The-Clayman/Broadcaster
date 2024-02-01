from processor import Processor, UPLOAD_DIR

from queue import Queue

from dao_service import DaoService


class BroadcasterApp:

    def __init__(self, logger):
        self.logger = logger
        self.task_queue = Queue()
        self.dao_service = DaoService(logger)
        self.processor = Processor(logger, self.task_queue, self.dao_service)

    def init_threads(self):
        self.processor.start()

    def add_new_video(self, file_name):
        video_name, video, message, return_code = self.dao_service.add_new_video(file_name)

        if return_code == 200:
            process_task = dict()
            process_task['type'] = "TRANSCODE"
            process_task['video_name'] = video_name
            self.task_queue.put(process_task)

        return message, return_code

    def get_video(self, video_name):
        video = self.dao_service.get_video(video_name)

        return video

    def get_video_array(self, video_name):
        video = self.dao_service.get_video_array(video_name)
        return video

    def delete_video(self, video_name):
        response_code = 200
        response_body = f"[{video_name}] deleted  successfully"

        video = self.get_video(video_name)
        if video:
            self.dao_service.delete_video(video_name)
        else:
            response_code = 409
            response_body = f"[{video_name=}] not found, delete skipped"

        return response_body, response_code


    def reprocess_video(self, video_name):
        response_code = 200
        response_body = f"[{video_name}] reprocessed successfully"
        video = self.dao_service.get_video_array(video_name)
        if video:
            process_task = dict()
            process_task['type'] = "TRANSCODE"
            process_task['video_name'] = video_name
            self.task_queue.put(process_task)
        else:
            response_body = "Reprocess cannot be completed, video not found"
            response_code = 409


        return response_body, response_code

    def play_video(self, video_name):
        response_code = 200
        response_body = f"[{video_name}] init play successfully"
        video = self.dao_service.get_video(video_name)
        if video:
            process_task = dict()
            process_task['type'] = "PLAY"
            process_task['video_name'] = video_name
            self.task_queue.put(process_task)
        else:
            response_body = f"play_video cannot be completed, video [{video_name}] not found"
            response_code = 409

        return response_body, response_code


    def stop_video(self, video_name):
        response_code = 200
        response_body = f"init stop [{video_name}] successfully"
        video = self.dao_service.get_video(video_name)
        if video:
            process_task = dict()
            process_task['type'] = "STOP"
            process_task['video_name'] = video_name
            self.task_queue.put(process_task)
        else:
            response_body = f"stop_video cannot be complete, video [{video_name}] not found"
            response_code = 409

        return response_body, response_code

    def retranscode_video(self, video_name):
        response_code = 200
        response_body = f"[{video_name}] init retrancode successfully"
        video = self.dao_service.get_video(video_name)
        if video:
            process_task = dict()
            process_task['type'] = "RETRANSCODE"
            process_task['video_name'] = video_name
            self.task_queue.put(process_task)
        else:
            response_body = f"Retranscode_video cannot be completed, video [{video_name}] not found"
            response_code = 409

        return response_body, response_code




