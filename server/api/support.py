from uuid import uuid4


def get_extension(filename):
    return '.%s' % filename.split('.')[-1].lower()


def var_to_string(var):
    return f'{var=}'.split('=')[0]


def is_valid_upload(filename, val_type, config):
    return get_extension(filename) in config.VALID[val_type]


def gen_rand_filename(filename):
    return str(uuid4())[:18] + get_extension(filename)


def upload_url(payload):
    return f"{config['UPLOAD_URL']}{payload}"
