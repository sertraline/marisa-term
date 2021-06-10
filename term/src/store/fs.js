import axios from 'axios';

export default {
  namespaced: true,
  state: {
      filesystem: [],
      index: [0]
  },

  getters: {
      filesystem: (state) => state.filesystem,
      index: (state) => state.index
  },

  mutations: {
      setFS: (state, data) => state.filesystem = data,
  },

  actions: {
      async getfs({ commit }) {
          let response = await axios.get('http://127.0.0.1:8050/fs')
          commit('setFS', response.data['data']['fs']);
          console.log(response.data['data']['fs']);
      }
  },
}
