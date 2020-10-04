import fsModule from 'fs';

const fs = fsModule.promises;
const STORE_FILE = './store.json';

class Store {
  constructor(){
    this._store = {};
  }

  load = async () => {
    const jsonStore = await fs.readFile(STORE_FILE);
    const parsedStore = JSON.parse(jsonStore);
    const mergedStore = {...this._store, ...parsedStore};
    this._store = mergedStore;
  }

  save = async () => {
    const stringifiedStore = JSON.stringify(this._store);
    fs.writeFile(STORE_FILE, stringifiedStore);
  }

  clear = () => {
    this._store = {};
  }

  add = (key, value) => {
    if(this.exists(key)){
      throw new Error('Key already exists. Use .addWithOverwrite() to overwrite value.');
    }
    this.addWithOverwrite(key, value);
  };

  addWithOverwrite = (key, value) => {
    this._store[key] = value;
  };

  get = (key) => {
    return this._store[key];
  };

  exists = (key) => {
    return !!this._store[key];
  };

  existsWithValue = (key, value) => {
    return !!this._store[key] && this.get(key) === value;
  };
};

export const store = new Store();
