const LocalStorage = require('./LocalStorage');

class ProductStorage extends LocalStorage {
    constructor() {
        super('product');
    }
}

module.exports = new ProductStorage();