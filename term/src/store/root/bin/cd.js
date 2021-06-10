class ChangeDirectory {
    static name = "Change directory";
    static id = "cd";

    static command = {
        'name': ChangeDirectory.name,
        'id': ChangeDirectory.id,
        'exec': ChangeDirectory.run
    }

    static run() {
        return {'response': 'test'}
    }

    static help() {
        return 'a'
    }
}

export default ChangeDirectory;