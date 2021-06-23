

class Less {
    static name = "Less output";
    static id = "less";

    static command = {
        'name': Less.name,
        'id': Less.id,
        'exec': Less.run
    }

    static run(args, stdin = null) {
        return new Promise( (resolve) => {
            if (!stdin) { resolve({'response': ''} )}

            resolve({
                'response': stdin,
                'mount': 'reader'
            })

        });
    }

    static help() {
        return 'a'
    }
}

export default Less;