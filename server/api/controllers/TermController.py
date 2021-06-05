from fastapi import Request
from ..services.TermService import TermService


class TermController:

    def __init__(self, config):
        self.config = config
        self.service = TermService(config)

    async def index(self, request: Request):
        return {"data": "I'm a teapot"}

    async def encode(self, request: Request):
        return {
            'data': {
                'encode': await self.service.encode(request)
            }
        }

    async def decode(self, request: Request):
        return {
            'data': {
                'decode': await self.service.decode(request)
            }
        }

    async def convert(self, request: Request):
        return {
            'data': {
                'convert': await self.service.convert(request)
            }
        }

    async def host(self, request: Request):
        return {
            'data': {
                'host': await self.service.host(request)
            }
        }

    async def weather(self, request: Request):
        return {
            'data': {
                'weather': await self.service.weather(request)
            }
        }

    async def fetch(self, request: Request):
        return {
            'data': {
                'fetch': await self.service.fetch(request)
            }
        }
