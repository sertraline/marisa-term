
export default {
  namespaced: true,
  state: {
      stdout: []
  },

  getters: {
      stdout: (state) => state.stdout
  },

  mutations: {
      stdpush: (state, item) => (state.stdout.push(item)),
      stdclear: (state) => (state.stdout = [])
  },

  actions: {
      stdwrite({ commit }, item) {
          if (!item) { return }
          commit('stdpush', item);
      },

      stdclear ({ commit }) {
          commit('stdclear');
      }
  },
}
