from .. import validations
import asyncio


class WeatherService:

    def __init__(self, config, mod):
        self.config = config
        self.mod = mod

    async def get_weather(self, data):
        if check := validations.weather.validate(self.config, data):
            return check
        city = data['args']

        loop = asyncio.get_event_loop()
        result = loop.run_in_executor(None, self.mod.weather.Processor.get_weather, city)
        return result
