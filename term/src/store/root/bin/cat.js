import store from '../..';


class Concat {
    static name = "Concantenate";
    static id = "cat";

    static command = {
        'name': Concat.name,
        'id': Concat.id,
        'exec': Concat.run
    }

    static run(args) {
        let arg = args.split(' ');
        return new Promise((resolve) => {
            if (arg.length < 2) { resolve({
                'response': 'cat.'
            })}

            let filename = arg[1];
            store.dispatch('http/fetch', filename)
                .then(function() {
                    resolve({
                        'response': store.state.http.response
                    });
            })
        })
    }
}

export default Concat