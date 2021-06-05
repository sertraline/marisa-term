from .. import support


def generic(config, data):
    if 'file' not in data:
        return config.ERR['NOFILE']

    file = data['file']
    if file.filename == '':
        return config.ERR['ERR_GENERIC']

    if not support.is_valid_upload(file.filename, 'image', config):
        return config.ERR['FILE_NONVALID']


def validate_upload_args(config, data):
    if check := generic(config, data):
        return check

    if 'args' not in data or not data['args']:
        return config.ERR['NOARGS']


def validate_upload_noargs(config, data):
    if check := generic(config, data):
        return check
