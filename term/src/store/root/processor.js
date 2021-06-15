import * as bin from './bin';

export default {
  namespaced: true,
  state: {
      packages: [
          bin.ls,
          bin.cd,
          bin.cat
      ]
  },

  getters: {
      commands: function(state) {
          let commands = {};

          Object.keys(state.packages)
              .map(function (key) {
                  commands[key] = state.packages[key].command;
              })

          return commands;
      }
  },

  mutations: {
  },

  actions: {
      /** mountTo: less / more
       *  response: someresponse
       *
       *  if mountTo in object:
       *  pass response to less/more component
       *  less/more get rendered with data
       *
       * Accepts: user input: [commmand, arg0, arg1, .., argN]
       * Iterates over packages listed in ./root/bin
       * If matches, runs package's method
       * Returns object that specifies
       *
       * @param state
       * @param payload
       * @returns {Promise<object>}
       */
    run({ state }, payload) {
        return new Promise( (resolve, reject) => {

            let id = payload.split(" ")[0];

            state.packages.forEach(function(pkg) {
                let command = pkg.command;

                console.log(command['id'], id);
                if (command['id'] === id) {
                    try {
                        command['exec'](payload).then((result) => {
                            console.log(result);
                            resolve(result);
                        })
                    } catch(e) {
                        reject({'response': `term: command not found: "${id}"`});
                    }
                }
            });

        })
    }
  }
}
