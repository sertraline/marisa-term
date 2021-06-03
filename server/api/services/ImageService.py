from .. import support
from .. import validations
import asyncio


class ImageService:

    def __init__(self, config, mod):
        self.config = config
        self.mod = mod

    async def encode(self, data):
        file = data['file']
        if check := validations.image.validate_image_upload(self.config, file, data):
            return check

        dest_filename = support.gen_rand_filename(file.filename)

        loop = asyncio.get_event_loop()
        result = loop.run_in_executor(None, self.mod.image.stegano_encode,
                                      *{
                                          'file': file,
                                          'filename': dest_filename,
                                          'text': data['args']
                                      })

        return result

    async def decode(self, data):
        file = data['file']
        if check := validations.image.validate_image_upload(self.config, file, data):
            return check

        loop = asyncio.get_event_loop()
        result = loop.run_in_executor(None, self.mod.image.stegano_decode, file)
        return result

    async def convert_image(self, data):
        file = data['file']
        if check := validations.image.validate_image_upload(self.config, file, data):
            return check

        dest_filename = support.gen_rand_filename(file.filename)
        loop = asyncio.get_event_loop()
        result = loop.run_in_executor(None, self.mod.image.img_convert,
                                      *{
                                          'file': file,
                                          'filename': dest_filename,
                                          'target_ext': data['args']
                                      })

        return result
