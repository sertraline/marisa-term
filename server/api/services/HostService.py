from .. import validations


class HostService:

    def __init__(self, config, mod):
        self.config = config
        self.mod = mod

    async def get_host(self, data):
        if check := validations.host.validate(self.config, data):
            return check
        host = data['args']
        result = self.mod.host.get_host(host)
        return result
