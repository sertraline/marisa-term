from fastapi import Request
from .. import services


class TermService:

    def __init__(self, config, mod):
        self.config = config
        self.mod = mod
        args = [self.config, self.mod]

        self.image_serv = services.ImageService.ImageService(*args)
        self.host_serv = services.HostService.HostService(*args)
        self.weather_serv = services.WeatherService.WeatherService(*args)

        self.args = {
            'encode': self.image_serv.encode,
            'decode': self.image_serv.decode,
            'convert': self.image_serv.convert_image,
            'host': self.host_serv.get_host,
            'weather': self.weather_serv.get_weather
        }

    async def encode(self, request: Request):
        data = await request.form()
        result = await self.image_serv.encode(data)
        return {
            'data': {
                'encode': result
            }
        }

    async def decode(self, request: Request):
        data = await request.form()
        result = await self.image_serv.decode(data)
        return {
            'data': {
                'decode': result
            }
        }

    async def convert(self, request: Request):
        data = await request.form()
        result = await self.image_serv.convert_image(data)
        return {
            'data': {
                'convert': result
            }
        }

    async def host(self, request: Request):
        data = await request.form()
        result = await self.host_serv.get_host(data)
        return {
            'data': {
                'host': result
            }
        }

    async def weather(self, request: Request):
        data = await request.form()
        result = await self.weather_serv.get_weather(data)
        return {
            'data': {
                'weather': result
            }
        }
