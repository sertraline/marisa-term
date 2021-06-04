import pyowm

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

    def __init__(self, config):
        self.owm = pyowm.OWM(config.OWM_API_KEY.Variables.OWM)
        self.manager = self.owm.weather_manager()

    def get_weather(self, city):
        if not city:
            return 'No city'

        try:
            weather = self.manager.weather_at_place(city)
        except pyowm.commons.exceptions.APIResponseError:
            return 'City name is wrong or not found.'

        w = weather.get_weather()

        wind, humidity, sunrise,\
        sunset, temp, status = w.get_wind(), w.get_humidity(),\
                               w.get_sunrise_time(timeformat='iso'),\
                               w.get_sunset_time(timeformat='iso'),\
                               w.get_temperature('celsius'),\
                               w.get_detailed_status()

        replyascii = CLEARASCII if ("clear" or "sunny") in status else OTHERASCII
        replyascii = CLOUDASCII if "cloud" in status else replyascii

        return(
            f"Weather:\n{replyascii[0]} {city}:\n"
            f"{replyascii[1]} TEMP: {temp['temp']}°C, {status}\n"
            f"{replyascii[2]} HUM: {humidity}%  WIND: {wind['speed']} m/s\n"
            f"{replyascii[3]} ◓ SUNRISE: {sunrise}\n"
            f"{replyascii[4]} ◒ SUNSET: {sunset}"
        )
