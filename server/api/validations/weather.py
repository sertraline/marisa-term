

def validate(config, data):
    if 'args' not in data or not data['args']:
        return config.ERR['NOARGS']
