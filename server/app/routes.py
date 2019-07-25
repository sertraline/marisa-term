from app import app
from app import processing
from flask import request, send_from_directory
import os, uuid, base64

def allowed_file(filename, ftype):
    ext = app.config['IMG_EXT'] if ftype == 'img' else app.config['EXT']
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ext

def random_fname(filename):
    # randomize name -> encode with base64
    fname = str(uuid.uuid4())[:12] + '_' + filename
    fname, ext = fname.rsplit('.', 1)
    fname = str(base64.b64encode(bytes(fname, 'utf-8')))[1:30].strip("'").strip("=") + '.' + ext
    return fname

@app.route('/')
@app.route('/index')
def index():
    return "hello"

@app.route('/api', methods = ['POST'])
def api():
    data = request.form
    if not data['req']:
        return 'None'

    if data['req'] == 'encode' and 'file' in request.files:
        myfile = request.files['file']
        if myfile.filename == '':
            return 'None'
        if not data['args']:
            return 'Your message is empty. Usage: encode [your message]'
        if not allowed_file(myfile.filename, 'img'):
            return f"This file extension is prohibited. Only {app.config['IMG_EXT']} are allowed."
        if myfile and allowed_file(myfile.filename, 'img'):
            fname = random_fname(myfile.filename)
            myfile.save(os.path.join(app.config['UPLOAD_FOLDER'], fname))
            encode = processing.encode(data['args'], os.path.join(app.config['UPLOAD_FOLDER'], fname))
            if encode:
                return(
                    f"""<p class="plain">"""
                    f"""<img class="image-output" src='{app.config['UPLOAD_URL']}{fname}'\></p>"""
                    f"""<p class="plain">Plain link:</p>"""
                    f"""<p class="plain"><a href="{app.config['UPLOAD_URL']}{fname}">{app.config['UPLOAD_URL']}{fname}</a></p>""")

    if data['req'] == 'decode' and 'file' in request.files:
        myfile = request.files['file']
        if myfile.filename == '':
            return 'None'
        if not allowed_file(myfile.filename, 'img'):
            return f"This file extension is prohibited. Only {app.config['IMG_EXT']} are allowed."
        if myfile and allowed_file(myfile.filename, 'img'):
            fname = random_fname(myfile.filename)
            myfile.save(os.path.join(app.config['UPLOAD_FOLDER'], fname))
            decode = processing.decode(os.path.join(app.config['UPLOAD_FOLDER'], fname))
            if decode:
                return(
                    f"""<p class="plain">"""
                    f"""<p class="plain">Decoded message:</p>"""
                    f"""<p class="plain">{decode}</p>""")

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
