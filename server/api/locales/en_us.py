var = {
    'ERR_GENERIC': 'Error',
    'NOFILE': 'No file provided',
    'MSG_EMPTY': 'Your message is empty. Usage: encode [your message]',
    'FILE_NONVALID': 'Unsupported file type',
    'HOST_NONVALID': 'Name or service not known',
    'NOARGS': 'No arguments provided'
}

for key, val in var.items():
    var[key] = """<span class='hg-fail'>error:</span> """ + val
