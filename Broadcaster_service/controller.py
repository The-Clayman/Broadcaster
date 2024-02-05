import logging
import sys
from flask_cors import CORS, cross_origin
from waitress import serve

from flask import Flask, request
from werkzeug.utils import secure_filename

import utils
from broadcaster_app import BroadcasterApp
from processor import UPLOAD_DIR, Processor

app = Flask(__name__)
CORS(app, resources={r"/broadcaster/v1/*": {"origins": "*"}}, methods=["GET", "POST", "PUT", "DELETE"])
app.config['UPLOAD_FOLDER'] = UPLOAD_DIR


logger = None
broadcaster = None





# The route() function of the Flask class is a decorator,
# which tells the application which URL should call
# the associated function.
@app.route('/')
# ‘/’ URL is bound with hello_world() function.
def hello_world():
    return 'Hello World'

@app.route('/broadcaster/v1/videos/<name>')
def get_video(name):
    global broadcaster
    return_code = 200
    data = ""
    try:
        data = broadcaster.get_video(name)
        if not data:
            data = f"video [{name}] not found"
    except Exception as e:
        logger.exception(f"get_video [{name=}] Error accor [{e=}]")
        data = utils.utils.wrap_message_in_json(str(e))
        return_code = 503

    return data, return_code

@app.route('/broadcaster/v1/videos')
def get_videos():
    global broadcaster
    global logger
    response_code = 200
    data = {}
    try:
        data = broadcaster.get_video_array(None)
    except Exception as e:
        logger.exception(f"get_videos Error accor [{e=}]")
        data = utils.utils.wrap_message_in_json(str(e))
        response_code = 500
    return data, response_code

@app.route('/broadcaster/v1/videos/', methods=['POST'])
@cross_origin()
def add_video():
    #https://flask.palletsprojects.com/en/2.3.x/patterns/fileuploads/
    global broadcaster
    global logger
    response_code = 200
    filename = "None"
    try:
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            response_code = 400
            logger.warning("no file where selected")

        elif file:
            filename = secure_filename(file.filename)
            file.save(f"{UPLOAD_DIR}/{filename}")
            message, response_code = broadcaster.add_new_video(filename)
    except Exception as e:
        message = f"Error accor during add_video request [{e=}]"
        logger.exception(message)
        response_code = 500

    return utils.utils.wrap_message_in_json(message), response_code

@app.route('/broadcaster/v1/videos/<name>', methods=['DELETE'])
def delete_video(name):
    global broadcaster
    global logger
    try:
        response_body, response_code = broadcaster.delete_video(name)

    except Exception as e:
        response_code = 500
        response_body = f"error while processing [{name}], e={str(e)}"

    return utils.utils.wrap_message_in_json(response_body), response_code

@app.route('/broadcaster/v1/videos/<video_name>', methods=['PUT'])
def reprocess_video(video_name):
    global broadcaster
    global logger
    try:
        response_body, response_code = broadcaster.reprocess(video_name)
    except Exception as e:
        logger.exception(f"Error occur during add_video request [{e=}]")
        response_body = str(e)
        response_code = 500


    return utils.utils.wrap_message_in_json(response_body), response_code



@app.route('/broadcaster/v1/player/<video_name>/play', methods=['POST'])
def play_video(video_name):
    global broadcaster
    global logger
    try:
        response_body, response_code = broadcaster.play_video(video_name)
    except Exception as e:
        logger.exception(f"Error occur during add_video request [{e=}]")
        response_body = str(e)
        response_code = 500

    return utils.utils.wrap_message_in_json(response_body), response_code


@app.route('/broadcaster/v1/player/<video_name>/stop', methods=['POST'])
def stop_video(video_name):
    global broadcaster
    global logger
    try:
        response_body, response_code = broadcaster.stop_video(video_name)
    except Exception as e:
        logger.exception(f"Error occur during add_video request [{e=}]")
        response_body = str(e)
        response_code = 500

    return utils.utils.wrap_message_in_json(response_body), response_code


@app.route('/broadcaster/v1/player/<video_name>/retranscode', methods=['POST'])
def retrascode_video(video_name):
    global broadcaster
    global logger
    try:
        response_body, response_code = broadcaster.retranscode_video(video_name)
    except Exception as e:
        logger.exception(f"Error occur during add_video request [{e=}]")
        response_body = str(e)
        response_code = 500

    return utils.utils.wrap_message_in_json(response_body), response_code



def init_logger():
    global logger
    # Create a custom logger
    logger = logging.getLogger(__name__)

    # Create handlers
    c_handler = logging.StreamHandler(sys.stdout)
    f_handler = logging.FileHandler('broadcaster.log')
    c_handler.setLevel(logging.INFO)
    f_handler.setLevel(logging.INFO)

    # Create formatters and add it to handlers
    c_format = logging.Formatter('%(name)s - %(levelname)s - %(message)s')
    f_format = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    c_handler.setFormatter(c_format)
    f_handler.setFormatter(f_format)

    # Add handlers to the logger
    logger.addHandler(c_handler)
    logger.addHandler(f_handler)

    logger.setLevel(logging.INFO)

    logger.info("this is info")
    logger.warning('This is a warning')
    logger.error('This is an error')
    return logger



# main driver function
if __name__ == '__main__':

    # run() method of Flask class runs the application
    # on the local development server.
    logger = init_logger()
    broadcaster = BroadcasterApp(logger)
    broadcaster.init_threads()
    serve(app, host="0.0.0.0", port=5000)


