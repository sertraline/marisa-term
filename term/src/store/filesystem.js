import axios from 'axios';

export default {
  namespaced: true,
  state: {
      filesystem: [],
      path: '/'
  },

  getters: {
      filesystem: (state) => state.filesystem,
      path: (state) => state.path
  },

  mutations: {
      setFS: (state, data) => state.filesystem = data,
      setPath: (state, data) => state.path = data,
  },

  actions: {
      async getfs({ commit }) {
          let response = await axios.get('http://127.0.0.1:8050/fs')
          commit('setFS', response.data['data']['fs']);
      }
  },
}
