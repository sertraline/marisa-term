from fastapi import Request
from .. import modules
from .. import support
from .. import validations
import asyncio
import pkgutil


class DependencyInjector:

    def __init__(self, config):
        self.collect(config)

    def collect(self, config):
        for _loader, _module_name, _ in pkgutil.walk_packages(modules.__path__):
            _module = _loader.find_module(_module_name).load_module(_module_name)
            globals()[_module_name] = _module
            setattr(self, _module_name, _module.Processor(config, support))


class TermService:

    def __init__(self, config):
        self.config = config
        self.di = DependencyInjector(config)

    async def encode(self, request: Request):
        data = await request.form()

        if check := validations.image.validate_image_upload(self.config, data):
            return check
        file = data['file']

        dest_filename = support.gen_rand_filename(file.filename)

        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, lambda: self.di.image.stegano_encode(
            **{
                'file': file.file,
                'filename': dest_filename,
                'text': data['args']
            }))

    async def decode(self, request: Request):
        data = await request.form()

        if check := validations.image.validate_image_upload(self.config, data):
            return check
        file = data['file']

        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.di.image.stegano_decode, file.file)

    async def convert(self, request: Request):
        data = await request.form()

        if check := validations.image.validate_image_upload(self.config, data):
            return check
        file = data['file']

        dest_filename = support.gen_rand_filename(file.filename)
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, lambda: self.di.image.img_convert(
            **{
                'file': file.file,
                'filename': dest_filename,
                'target_ext': data['args']
            }))

    async def host(self, request: Request):
        data = await request.form()
        if check := validations.host.validate(self.config, data):
            return check
        host = data['args']
        return self.di.host.get_host(host)

    async def weather(self, request: Request):
        data = await request.form()
        if check := validations.weather.validate(self.config, data):
            return check
        city = data['args']

        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.di.weather.get_weather, city)

    async def fetch(self, request: Request):
        data = await request.form()
        if check := validations.fetch.validate(self.config, data):
            return check

        filename = data['filename']
        split = 'split' in data

        return self.di.fetch.read_file(filename, split)
