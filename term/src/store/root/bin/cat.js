import store from '../..';


class Concat {
    static name = "Concantenate";
    static id = "cat";

    static command = {
        'name': Concat.name,
        'id': Concat.id,
        'exec': Concat.run
    }

    static run() {
        return new Promise((resolve) => {
            store.dispatch('http/fetch', 'router.py')
                .then(function() {
                    resolve({
                        'response': store.state.http.response
                    });
            })
        })
    }
}

export default Concat