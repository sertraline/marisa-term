import axios from 'axios';

export default {
  namespaced: true,
  state: {
      response: {}
  },

  getters: {
      response: (state) => state.response,
  },

  mutations: {
      setResponse: (state, data) => state.response = data,
  },

  actions: {
      async callApi({ commit }, path) {
          let response = await axios.post(`http://127.0.0.1:8050/${path}`);
          commit('setResponse', response.data['data'][path]);
      },

      async fetch({ commit }, filename) {
          const formData = new FormData();
          formData.append('filename', filename);

          let response = await axios.post(`http://127.0.0.1:8050/fetch`, formData);
          commit('setResponse', response.data['data']['fetch'])
      }
  },
}
