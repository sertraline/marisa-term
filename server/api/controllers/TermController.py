from fastapi import Request
from ..services.TermService import TermService


def validate(func):
    async def wrapper(*args, **kwargs):
        data = await args[0].form()
        if 'req' not in data or not data['req']:
            return 'req is missing and is a required field.'
        return await func(*args, **kwargs)
    return wrapper


class TermController:

    def __init__(self, service):
        self.service = service

    async def index(self, request: Request):
        return {"data": "I'm a teapot"}

    @validate
    async def encode(self, request: Request):
        return await self.service.encode(request)

    @validate
    async def decode(self, request: Request):
        return await self.service.decode(request)

    @validate
    async def convert(self, request: Request):
        return await self.service.convert(request)

    @validate
    async def host(self, request: Request):
        return await self.service.host(request)

    @validate
    async def weather(self, request: Request):
        return await self.service.weather(request)
