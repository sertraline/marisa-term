from app import app
from app import processing
from flask import request

@app.route('/')
@app.route('/index')
def index():
    return "hello"

@app.route('/api', methods = ['POST'])
def api():
    data = request.form

    if not data['req']:
        return 'None'

    if data['req'] == 'host':
        if not data['args']:
            return 'None'
        domain = data['args']
        get_ip = processing.hostbyname(domain)
        return get_ip

    if data['req'] == 'weather':
        if not data['args']:
            return 'None'
        city = data['args']
        get_weather = processing.getWeather(city)
        return get_weather
    
    return "None"
