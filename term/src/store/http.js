import axios from 'axios';

export default {
  namespaced: true,
  state: {
      response: 'abcd'
  },

  getters: {
      response: (state) => state.response,
  },

  mutations: {
      setResponse: (state, data) => state.response = data,
  },

  actions: {
      async callApi({ commit }, { path, args, file }) {
          const formData = new FormData();

          formData.append('args', args);

          if (file) {
              formData.append('file', file);
          }

          let response = await axios.post(`http://127.0.0.1:8050/${path}`, formData);
          commit('setResponse', response.data['data'][path]);
          return response.data['data'];
      },

      async fetch({ commit }, filename) {
          const formData = new FormData();
          formData.append('filename', filename);
          let response = await axios.post(`http://127.0.0.1:8050/fetch`, formData);
          commit('setResponse', response.data['data']['fetch'])
      }
  },
}
