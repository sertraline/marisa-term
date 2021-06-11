import store from '../..';


class ListDirectory {
    static name = "List directory";
    static id = "ls";

    static command = {
        'name': ListDirectory.name,
        'id': ListDirectory.id,
        'exec': ListDirectory.run
    }

    static iter(data, target) {
        for (let key in data) {
            if (data[key]['path'] === target) {
                return data[key];
            }

            if ('children' in data[key]) {
                if (data[key]['children'].length > 0) {
                    let res = ListDirectory.iter(data[key]['children'], target);
                    if (res) {
                        return res;
                    }
                }
            }
        }
    }

    static run(args) {
        let data = store.state.fs.filesystem;
        let path = store.state.fs.path;
        let out = '..\n';

        // get target node
        let arg = args.split(' ');
        if (arg.length === 0 || !arg[1]) {
            arg = path;
        } else { arg = arg[1] }

        if (arg === '..') {
            arg = path.split('/').slice(0, -1).join('/');
            if (!arg) {
                arg = path;
            }
        }

        // locate requested node in filesystem
        let target = ListDirectory.iter(data, arg);

        if (target) {
            if (target['type'] === 'F') {
                out = target['name'];
            } else {
                out += '.\n';
                if (target['children'].length > 0) {
                    for (let key in target['children']) {
                        out += target['children'][key]['name'];
                        out += '\n';
                    }
                }
            }
        } else {
            out = `ls: cannot access '${arg}': no such file or directory.`;
        }

        return {'response': out};
    }

    static help() {
        return 'a'
    }
}

export default ListDirectory;