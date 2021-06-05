from os.path import join, isfile, isdir
import re


class Processor:

    def __init__(self, config, support):
        self.config = config
        self.support = support
        self.dir = config.STATIC_DIR

    def read_file(self, filename, split=False):
        path = join(self.dir, filename)
        if not isfile(path):
            return self.config.ERR['NOTFOUND']

        with open(path, 'r', encoding='utf-8') as f:
            data = f.read()
        if split:
            data = data.split('\n')
            toret = []
            for line in data:
                line = re.sub(r'https?:\/\/[^\s]+', r'<a class="term-link" href="\g<0>">\g<0></a>', line)
                toret.append(line)
            data = '\n'.join(toret)
        return data
