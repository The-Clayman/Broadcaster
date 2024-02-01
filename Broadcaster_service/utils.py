import json
import os

import utils

class utils:

    def fstr(fstring_text, locals, globals=None):
        """
        Dynamically evaluate the provided fstring_text
        """
        locals = locals or {}
        globals = globals or {}
        ret_val = eval(f'f"{fstring_text}"', locals, globals)
        return ret_val

    def get_base_name(filename):
        return os.path.splitext(filename)[0]

    def get_filename_from_path(path_with_file):
        return os.path.basename(path_with_file)

    def wrap_message_in_json(message):
        res = message
        try:
            res = json.dumps({"message": f"{message}"})
        except :
            res = message

        return res


utils.fstr = staticmethod(utils.fstr)
utils.get_base_name = staticmethod(utils.get_base_name)
utils.get_filename_from_path = staticmethod(utils.get_filename_from_path)
