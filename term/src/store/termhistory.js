
export default {
  namespaced: true,
  state: {
      history: []
  },

  getters: {
      history: (state) => state.history
  },

  mutations: {
      push: (state, item) => (state.history.push(item)),
      shift: (state, callback) => (callback.out = state.history.shift()),
      unshift: (state, item) => (
          state.history.pop() && state.history.unshift(item)
      ),
      pop: (state) => (state.history.pop())
  },

  actions: {
      push({ commit, state }, item) {

          if (!item) { return }

          if(state.history.length > 25 ) {
              commit('shift', {});
          }

          commit('push', item);
      },

      pop({ commit }) {
          commit('pop');
      },

      shift({ commit }, callback) {
          commit('shift', callback);
      },

      unshift({ commit }, item) {
          commit('unshift', item);
      }
  },
}
