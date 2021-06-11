import store from "../..";


class ChangeDirectory {
    static name = "Change directory";
    static id = "cd";

    static command = {
        'name': ChangeDirectory.name,
        'id': ChangeDirectory.id,
        'exec': ChangeDirectory.run
    }

    static iter(data, target) {
        for (let key in data) {
            if (data[key]['path'] === target) {
                return data[key];
            }

            if ('children' in data[key]) {
                if (data[key]['children'].length > 0) {
                    let res = ChangeDirectory.iter(data[key]['children'], target);
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
        let out = '';

        // get target node
        let arg = args.split(' ');
        if (arg.length === 0 || !arg[1]) {
            arg = '/';
        } else { arg = arg[1] }

        // jump to dir above
        if (arg === '..') {
            arg = '/' + path.split('/').slice(0, -1).join('/');
            if (!arg) {
                arg = path;
            }
        }

        let target;
        let current_dir = ChangeDirectory.iter(data, path);
        if (!arg.startsWith('/')) {
            if (current_dir['children'].length > 0 ) {
                let fullpath = `${path}/${arg}`
                               .replace(/^\/+|\/+$/g, '');
                target = ChangeDirectory.iter(data, fullpath);
                console.log(target, arg);
            }
        } else {
            if (arg !== '/') {
                arg = arg.split('/').slice(1,).join('/')
            }
            target = ChangeDirectory.iter(data, arg);
        }

        console.log(target);
        if (!target) {
            out = `${arg}: no such file or directory.`;
        } else {
            if(target['type'] === 'F') {
                out = `${arg}: is a file.`;
            } else {
                store.commit('fs/setPath', target['path']);
            }
        }

        return { 'response': out }

    }

    static help() {
        return 'a'
    }
}

export default ChangeDirectory;