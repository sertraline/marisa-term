import store from '../..';


class Concat {
    static name = "Concantenate";
    static id = "cat";

    static command = {
        'name': Concat.name,
        'id': Concat.id,
        'exec': Concat.run
    }

    static run(args, stdin = null) {
        console.log('args cat: ', args, stdin);
        let arg = args.split(' ');

        return new Promise((resolve) => {
            if (arg.length < 2 && !stdin) { resolve({
                'response': 'cat.'
            })} else if (arg.length < 2 && stdin) { resolve( {
                'response': stdin
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