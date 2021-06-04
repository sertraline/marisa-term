from fastapi import Request
from .. import services
from .. import modules


class TermService:

    def __init__(self, config):
        self.config = config

        args = [
            config,
            modules
        ]

        self.image_serv = services.ImageService.ImageService(*args)
        self.host_serv = services.HostService.HostService(*args)
        self.weather_serv = services.WeatherService.WeatherService(*args)

    async def encode(self, request: Request):
        data = await request.form()
        return {
            'data': {
                'encode': await self.image_serv.encode(data)
            }
        }

    async def decode(self, request: Request):
        data = await request.form()
        return {
            'data': {
                'decode': await self.image_serv.decode(data)
            }
        }

    async def convert(self, request: Request):
        data = await request.form()
        return {
            'data': {
                'convert': await self.image_serv.convert_image(data)
            }
        }

    async def host(self, request: Request):
        data = await request.form()
        return {
            'data': {
                'host': await self.host_serv.get_host(data)
            }
        }

    async def weather(self, request: Request):
        data = await request.form()
        return {
            'data': {
                'weather': await self.weather_serv.get_weather(data)
            }
        }
