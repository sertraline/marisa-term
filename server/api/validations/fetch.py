
def validate(config, data):
    if 'filename' not in data or not data['filename']:
        return config.ERR['NOARGS']
