import pyowm
from datetime import datetime

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


class Processor:

    def __init__(self, config, support):
        self.support = support
        self.owm = pyowm.OWM(config.OWM_API_KEY)
        self.manager = self.owm.weather_manager()

    def get_weather(self, city):
        if not city:
            return 'No city'

        try:
            weather = self.manager.weather_at_place(city)
        except pyowm.commons.exceptions.APIResponseError:
            return 'City name is wrong or not found.'

        w = weather.to_dict()
        w = w['weather']
        wind, humidity, sunrise, \
            sunset, temp, status = (w['wind'], w['humidity'],
                                    w['sunrise_time'], w['sunset_time'],
                                    weather.weather.temperature('celsius'),
                                    w['detailed_status'])

        sunrise = datetime.utcfromtimestamp(sunrise).strftime('%Y-%m-%d %H:%M')
        sunset = datetime.utcfromtimestamp(sunset).strftime('%Y-%m-%d %H:%M')

        replyascii = CLEARASCII if ("clear" or "sunny") in status else OTHERASCII
        replyascii = CLOUDASCII if "cloud" in status else replyascii

        return (
            f"Weather:\n{replyascii[0]} {city}:\n"
            f"{replyascii[1]} TEMP: {temp['temp']}°C, {status}\n"
            f"{replyascii[2]} HUM: {humidity}%  WIND: {wind['speed']} m/s\n"
            f"{replyascii[3]} ◓ SUNRISE: {sunrise}\n"
            f"{replyascii[4]} ◒ SUNSET: {sunset}"
        )
