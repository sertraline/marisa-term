import axios from 'axios';

export default {
  namespaced: true,
  state: {
      filesystem: [],
      index: [0]
  },

  getters: {
      filesystem: (state) => state.filesystem
  },

  mutations: {
      setFS: (state, data) => this.filesystem = data,
  },

  actions: {
      async getfs({ commit }) {
          let response = await axios.get('http://127.0.0.1/api/fs')
          commit('setFS', response.data);
      }
  },
}
