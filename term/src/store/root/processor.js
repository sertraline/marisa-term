import * as bin from './bin';

export default {
  namespaced: true,
  state: {
      packages: [
          bin.ls,
          bin.cd,
          bin.cat,
          bin.imgconvert,
          bin.less
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
       * @param data
       * @returns {Promise<object>}
       */
    run({ state }, data) {

        let payload = data['data'];
        let stdin;
        if ('stdin' in data) {
            stdin = data['stdin'];
        }

        return new Promise( (resolve, reject) => {

            let id = payload.split(" ")[0];
            let count = 0;

            state.packages.forEach(function(pkg) {
                let command = pkg.command;

                let args;
                if(stdin) {
                    args = [payload, stdin];
                } else {
                    args = [payload]
                }

                if (command['id'] === id) {
                    try {
                        console.log('exec with args ', ...args);
                        command['exec'](...args).then((result) => {
                            console.log(result);
                            resolve(result);
                        })
                    } catch(e) {
                        reject({'response': `term: command not found: "${id}"`});
                    }
                } else { count += 1 }
            });

            if (count === state.packages.length) {
                resolve({'response': `term: command not found: "${id}"`})
            }

        })
    }
  }
}
