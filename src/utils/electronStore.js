import { devType } from './../config/config'
let electronStore = {}
if (devType === 'react') {


  const localStorage = window.localStorage;

  electronStore = {
    set: (key, value) => {
      return localStorage.setItem(key, JSON.stringify(value));
    },
    get: (key) => {
      try {
        const value = localStorage.getItem(key);
        if (value === null || value === undefined || value === "") {
          return null;
        }
        return JSON.parse(localStorage.getItem(key));
      } catch (err) {
        return null
      }
    },
    delete: (key) => {
      return localStorage.removeItem(key);
    },
    clear: () => {
      localStorage.clear()
    }
  }


} else if (devType === 'electron') {
  const Store = window.require('electron-store');
  const store = new Store();

  electronStore = {
    set: (key, value) => {
      return store.set(key, value)
    },
    get: (key) => {
      return store.get(key)
    },
    delete: (key) => {
      return store.delete(key)
    },
    clear: () => {
      store.clear()
    }
  }


}
export default electronStore

