from flask import Flask

UPLOAD_URL = 'https://tsunagari.space/temp/'
UPLOAD_FOLDER = '/var/www/html/temp/'
ALLOWED_EXT = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
IMG_EXT = {'png', 'jpg', 'jpeg', 'webp', 'gif'}

app = Flask(__name__)
app.config['UPLOAD_URL'] = UPLOAD_URL
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['EXT'] = ALLOWED_EXT
app.config['IMG_EXT'] = IMG_EXT

from app import routes
