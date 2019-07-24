from app import module_config
from socket import gethostbyname, gaierror
import pyowm
import re

# use some functionality from awful-bot
CLEARASCII = [r"     \   /     ",
              r"      .-.      ",
              r"   ― (   ) ―   ",
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
        return 'None'
    except:
        return 'None'
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
        return("No city was set!")