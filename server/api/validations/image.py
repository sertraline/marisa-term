from .. import support


def validate_image_upload(config, file, data):
    if file.filename == '':
        return config.ERR['ERR_GENERIC']

    if not data['args']:
        return config.ERR['MSG_EMPTY']

    if not support.is_valid_upload(file.filename, 'image'):
        return config.ERR['FILE_NONVALID']
