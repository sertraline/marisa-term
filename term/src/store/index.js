import { createStore } from 'vuex'
import history from "./termhistory";
import processor from "./root/processor";
import stdout from "./stdout";

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    history,
    processor,
    stdout
  }
})
