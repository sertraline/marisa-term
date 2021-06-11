import { createStore } from 'vuex'
import termhistory from "./termhistory";
import processor from "./root/processor";
import stdout from "./stdout";
import filesystem from "./filesystem";


export default createStore({
  modules: {
    termhistory,
    processor,
    stdout,
    filesystem
  }
})
