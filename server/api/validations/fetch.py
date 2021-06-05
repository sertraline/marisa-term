
def validate(config, data):
    if not data['args']:
        return config.ERR['NOARGS']
