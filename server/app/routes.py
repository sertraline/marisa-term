from app import app
from app import processing
from flask import request, send_from_directory
import os, uuid, base64

def allowed_file(filename, ftype):
    if ftype == 'img':
        ext = app.config['IMG_EXT']
    else:
        ext = app.config['EXT']
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ext

def random_fname(filename):
    # randomize name -> encode with base64
    fname = str(uuid.uuid4())[:12] + '_' + filename
    fname, ext = fname.rsplit('.', 1)
    fname = str(base64.b64encode(bytes(fname, 'utf-8')))[1:30].strip("'").strip("=") + '.' + ext
    return fname

PROHIBIT_IMG_ERROR = (
    f"<span class='hg-fail'>error:</span> this file extension is prohibited. "
    f"Only {', '.join(app.config['IMG_EXT'])} are allowed.")
FAIL = "<span class='hg-fail'>None</span>"

@app.route('/')
@app.route('/index')
def index():
    return "hello"

@app.route('/api', methods = ['POST'])
def api():
    data = request.form
    if not data['req']:
        return FAIL
    
    if data['req'] == 'encode' and 'file' in request.files:
        userfile = request.files['file']
        if userfile.filename == '':
            return FAIL
        if not data['args']:
            return "<span class='hg-fail'>error:</span> your message is empty. Usage: encode [your message]"
        if not allowed_file(userfile.filename, 'img'):
            return PROHIBIT_IMG_ERROR
        if userfile and allowed_file(userfile.filename, 'img'):
            fname = random_fname(userfile.filename)
            result = processing.encode(userfile, fname, app.config['UPLOAD_FOLDER'], data['args'])
            if result:
                return(
                    f"""<p class="plain">"""
                    f"""<img class="image-output" src='{app.config['UPLOAD_URL']}{result}'\></p>"""
                    f"""<p class="plain">Plain link:</p>"""
                    f"""<p class="plain"><a href="{app.config['UPLOAD_URL']}{result}">{app.config['UPLOAD_URL']}{result}</a></p>""")

    if data['req'] == 'decode' and 'file' in request.files:
        userfile = request.files['file']
        if userfile.filename == '':
            return FAIL
        if not allowed_file(userfile.filename, 'img'):
            return PROHIBIT_IMG_ERROR
        if userfile and allowed_file(userfile.filename, 'img'):
            fname = random_fname(userfile.filename)
            decoded = processing.decode(userfile)
            if decoded:
                return(
                    f"""<p class="plain">"""
                    f"""<p class="plain">Decoded message:</p>"""
                    f"""<p class="plain">{decoded}</p>""")

    if data['req'] == 'imgconvert' and 'file' in request.files:
        userfile = request.files['file']
        if not data['args']:
            return (
            f"<span class='hg-fail'>you haven't specified format to convert your image to.\n"
            f"usage: imgconvert [{app.config['IMG_EXT'].join('|')}]</span>")
        if not allowed_file(userfile.filename, 'img') or data['args'] not in app.config['IMG_EXT']:
            return PROHIBIT_IMG_ERROR
        if userfile.filename == '':
            return FAIL
        if userfile and allowed_file(userfile.filename, 'img'):
            fname = random_fname(userfile.filename)
            result = processing.imgconvert(userfile, fname, app.config['UPLOAD_FOLDER'], data['args'])
            if isinstance(result, list):
                return(
                    f"""<p class="plain">{result[1]}</p>"""
                )
            elif result:
                return(
                    f"""<p class="plain">"""
                    f"""<img class="image-output" src='{app.config['UPLOAD_URL']}{result}'\></p>"""
                    f"""<p class="plain">Plain link:</p>"""
                    f"""<p class="plain"><a href="{app.config['UPLOAD_URL']}{result}">{app.config['UPLOAD_URL']}{result}</a></p>""")

    if data['req'] == 'htmltopdf':
        if not data['args']:
            return f"<span class'hg-fail'>you haven't specified a website.</span>"
        website = data['args']
        fname = website+'.pdf'
        fname = random_fname(fname)
        result = processing.htmltopdf(fname, app.config['UPLOAD_FOLDER'], website)
        if isinstance(result, list):
            return(
                f"""<p class="plain">{result[1]}</p>"""
            )
        if result:
            return(
                f"""<p class="plain">Plain link:</p>"""
                f"""<p class="plain"><a href="{app.config['UPLOAD_URL']}{result}">{app.config['UPLOAD_URL']}{result}</a></p>"""
            )
        

    if data['req'] == 'host':
        if not data['args']:
            return FAIL
        domain = data['args']
        get_ip = processing.hostbyname(domain)
        return get_ip

    if data['req'] == 'weather':
        if not data['args']:
            return FAIL
        city = data['args']
        get_weather = processing.getWeather(city)
        return get_weather
    
    return FAIL
