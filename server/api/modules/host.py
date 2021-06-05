from socket import gaierror, gethostbyname
import re


class Processor:

    def __init__(self, config, support):
        self.config = config
        self.support = support

    def get_host(self, host):
        try:
            return self.call_host(host)
        except (TypeError, gaierror):
            return self.config.ERR['HOST_NONVALID']

    def parse_host(self, host):
        f1 = host.find('://')
        if f1 != -1:
            host = host[f1+3:]

        # cut to domain
        f1 = host.find('/')
        if f1 != -1:
            host = host[:f1]

        # cut port
        f1 = host.find(':')
        if f1 != -1:
            host = host[:f1]

        return re.sub(r'[^\d\w.:/]', '', host)

    def call_host(self, host):
        host = self.parse_host(host)
        return gethostbyname(host)
