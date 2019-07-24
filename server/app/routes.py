from app import app
from flask import request
from socket import gethostbyname

@app.route('/')
@app.route('/index')
def index():
    return "hello"

@app.route('/api', methods = ['POST'])
def api():
    data = request.form
    if data['req']:
        if data['req'] == 'gethostbyname':
            if not data['args']:
                return 'None'
            host = data['args']
            result = host.replace('http://', '').replace('https://', '')
            cut_link = result.find('/')
            result = result[:cut_link] if cut_link != -1 else result
            req = gethostbyname(result)
            return req
