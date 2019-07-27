from app import module_config
from socket import gethostbyname, gaierror
from PIL import Image
import pyowm, re, binascii

# use some functionality from awful-bot
CLEARASCII = [r"     \   /     ",
              r"      .-.      ",
              r"  ― (   ) ―   ",
              r"      '-’      ",
              r"     /   \     "]
CLOUDASCII = [r"    \  /       ",
              r" __ /‘‘.-.     ",
              r"    \_(   ).   ",
              r"    /(___(__)  ",
              r"               "]
OTHERASCII = [r"      .-.      ",
              r"     (   ).    ",
              r"    (___(__)   ",
              r"   ‚‘‚‘‚‘‚‘    ",
              r"   ‚’‚’‚’‚’    "]

def hostbyname(host):
    try:
        result = host.replace('http://', '').replace('https://', '').replace('ftp://', '')
        cut_link = result.find('/')
        result = result[:cut_link] if cut_link != -1 else result
        cut_port = result.find(':')
        result = result[:cut_port] if cut_port != -1 else result
        regx = re.compile(r'[^\d\w\.\:\/]')
        result = regx.sub('', result)
        req = gethostbyname(result)
    except gaierror as err:
        print(err)
        return "<span class='hg-fail'>error:</span> name or service not known."
    except:
        return "<span class='hg-fail'>None</span>"
    return req

def getWeather(city):
    if city:
        owm = pyowm.OWM(module_config.Variables.OWM, language='en')
        try:
            getweather = owm.weather_at_place(city)
        except pyowm.exceptions.not_found_error.NotFoundError:
            return 'City name is wrong or not found.'
        w = getweather.get_weather()
        wtime = w.get_reference_time(timeformat='iso')
        wind, humidity, sunrise, sunset, temp, status = w.get_wind(), w.get_humidity(), w.get_sunrise_time(
        timeformat='iso'), w.get_sunset_time(timeformat='iso'), w.get_temperature('celsius'), w.get_detailed_status()
        replyascii = CLEARASCII if ("clear" or "sunny") in status else OTHERASCII
        replyascii = CLOUDASCII if "cloud" in status else replyascii
        return(
            f"Weather:\n{replyascii[0]} {city}:\n"
            f"{replyascii[1]} TEMP: {temp['temp']}°C, {status}\n"
            f"{replyascii[2]} HUM: {humidity}%  WIND: {wind['speed']} m/s\n"
            f"{replyascii[3]} ◓ SUNRISE: {sunrise}\n"
            f"{replyascii[4]} ◒ SUNSET: {sunset}")
    else:
        return("<span class='hg-fail'>error:</span> no city was set.")

def imgconvert(file, filename, save_path, toformat):
    filename, ext = filename.rsplit('.', 1)
    ext = ext.lower()
    if ext == toformat:
        return [1, f"Your image is already {toformat}."]

    image = Image.open(file)
    filename = filename + '.' + toformat

    if toformat in ('jpg', 'jpeg'):
        r_im = image.convert('RGB')
        r_im.save(save_path+filename, 'JPEG')
    elif toformat == 'png':
        image.save(save_path+filename, 'PNG')
    elif toformat == 'webp':
        image.save(save_path+filename, 'WEBP')
    elif toformat == 'gif':
        image.save(save_path+filename, 'GIF')
    else:
        return [1, "Format was not recognized."]
    return filename

def decode(file):
    image = Image.open(file)
    red_channel, green_channel, blue_channel, *alpha = image.convert('RGB').split()
    x, y = image.size[0], image.size[1]  

    text = ''
    delim = '001011110010110100101111'

    for x_pixel in range(x):
        for y_pixel in range(y):
            bin_im_pixel = bin(red_channel.getpixel((x_pixel, y_pixel)))
            text += bin_im_pixel[-1]
            if len(text) > len(delim):
                if delim in text[-24:]:
                    text = text[:-24]
                    return (int(text, 2).to_bytes((len(text) + 7) // 8, 'big')).decode()
    try:
        return (int(text, 2).to_bytes((len(text) + 7) // 8, 'big')).decode()
    except UnicodeDecodeError:
        return "<span class='hg-fail'>error:</span> image is not encoded or is invalid."


def encode(file, filename, save_path, text):
    image = Image.open(file)
    red_channel, green_channel, blue_channel, *alpha = image.split()
    x, y = image.size[0], image.size[1]

    filename, ext = filename.rsplit('.', 1)
    ext = ext.lower()
    for i in ('jpg', 'jpeg'):
        if i in ext:
            ext = ext.replace(i, 'png')
    filename = filename + '.' + ext

    counter = 0
    delim = '001011110010110100101111'
    bin_text = bin(int(binascii.hexlify(text.encode()),16))[2:]

    for x_cord in range(x):
        for y_cord in range(y):
            if counter >= len(bin_text):
                if bin_text == delim:
                    if alpha:
                        result = Image.merge("RGBA", [red_channel, green_channel, blue_channel, alpha[0]])
                    else:
                        result = Image.merge("RGB", [red_channel, green_channel, blue_channel])
                    result.save(save_path+filename, 'PNG')
                    return filename
                counter = 0
                bin_text = delim
            bin_im_pixel = bin(red_channel.getpixel((x_cord, y_cord)))
            bin_im_pixel = bin_im_pixel[:-1] + '1' if bin_text[counter] == '1' else bin_im_pixel[:-1] + '0'

            red_channel.putpixel((x_cord, y_cord), int(bin_im_pixel, base=2))
            counter+=1