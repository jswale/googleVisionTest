class LocalStorage {

    constructor() {
        this.clear();
    }

    clear() {
        this.datas = {};
    }

    add(key, value) {
        this.datas[key] = value;
    }

    remove(key) {
        delete this.datas[key];
    }

    get(key) {
        return this.datas[key];
    }

    list() {
        return Object.values(this.datas);
    }

    keys() {
        return Object.keys(this.datas);
    }

    getTotal() {
        return this.keys().length;
    }
}

module.exports = LocalStorage;