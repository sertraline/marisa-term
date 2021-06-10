class ListDirectory {
    static name = "List directory";
    static id = "ls";

    static command = {
        'name': ListDirectory.name,
        'id': ListDirectory.id,
        'exec': ListDirectory.run
    }

    static run() {
        return {'response': 'test'};
    }

    static help() {
        return 'a'
    }
}

export default ListDirectory;