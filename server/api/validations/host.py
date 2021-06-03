FORBIDDEN = (
    '192.192.',
    '192.168.',
    '127.0.',
    'localhost',
    '0.',
    '::'
)


def validate(config, data):
    if not data['args']:
        return config.ERR['NOARGS']
    host = data['args']
    if any(item in host for item in FORBIDDEN):
        return config.ERR['HOST_NOVALID']
