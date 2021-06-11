import { createStore } from 'vuex'
import termhistory from "./termhistory";
import processor from "./root/processor";
import stdout from "./stdout";
import fs from "./fs";


export default createStore({
  modules: {
    termhistory,
    processor,
    stdout,
    fs
  }
})
