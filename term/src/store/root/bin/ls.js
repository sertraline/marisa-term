import store from '../..';


class ListDirectory {
    static name = "List directory";
    static id = "ls";

    static command = {
        'name': ListDirectory.name,
        'id': ListDirectory.id,
        'exec': ListDirectory.run
    }

    static run() {
        let data = store.state.fs.filesystem;
        let out = '';

        for (let key in data) {
            out += data[key]['name'];
            out += ' ';
        }

        return {'response': out};
    }

    static help() {
        return 'a'
    }
}

export default ListDirectory;