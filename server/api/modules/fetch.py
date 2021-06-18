from os.path import join, isfile, realpath
import re
import glob
import pathlib
import hashlib


class Processor:

    def __init__(self, config, support):
        self.config = config
        self.support = support
        self.dir = config.STATIC_DIR

    def read_file(self, filename, split=False):
        def iterf(files, hashed):
            for file in files:
                if 'hash' in file:
                    print(file['hash'], file['path'], hashed)
                    if file['hash'] == hashed:
                        return file['path']
                if 'children' in file:
                    path = iterf(file['children'], hashed)
                    if path:
                        return path

        path = join(self.dir, filename)
        path = realpath(path)

        hashed = hashlib.md5(path
                             .replace('/var/www/html/content/', '')
                             .encode('utf-8')
                             ).hexdigest()
        files = self.filesystem()
        static_path = iterf(files, hashed)

        if not static_path:
            print(path, path.replace('/var/www/html/content/', ''))
            return self.config.ERR['NOTFOUND']

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

    def filesystem(self):
        def get_node(e):
            e = e.strip('.').strip('/')
            if any([e.startswith(i) for i in ['marisa-term', 'env', 'venv', '__']]):
                return
            node = {}

            node['name'] = e.split('/')[-1]
            if node['name'].startswith('__') or node['name'].startswith('.'):
                return

            node['path'] = e
            if not node['name']:
                node['name'] = '.'

            if isfile(e):
                node['type'] = 'F'
                node['hash'] = hashlib.md5(node['path'].encode('utf-8')).hexdigest()
            else:
                node['type'] = 'D'

            stat = pathlib.Path(e).stat()
            node['created'] = stat.st_ctime
            node['modified'] = stat.st_mtime
            node['parent'] = '/'.join(e.split('/')[:-1])
            if not node['parent']:
                node['parent'] = '.'
            if not node['path']:
                node['path'] = '/'
            if node['type'] == 'D':
                node['children'] = []
            return node

        fs = list(map
                  (get_node, [f for f in glob.glob('./**', recursive=True)])
                  )
        fs = [i for i in fs if i]

        for index, node in enumerate(fs[1:]):
            if node['parent']:
                for parent_node in fs:
                    if node['parent'] == parent_node['path']:
                        if 'children' in parent_node:
                            parent_node['children'].append(node)
        fs = [i for i in fs if (not i['parent'] or i['parent'] == '.')]
        fs[0]['children'].extend(fs[1:])
        return [fs[0]]
