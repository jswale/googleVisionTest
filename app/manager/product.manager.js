const fs = require('fs');
const fcsv = require('fast-csv');
const Product = require('../domain/Product.domain');
const storage = require('../storage/product.storage');

class Manager {

    /**
     * Retreive a product by his id
     *
     * @param id
     * @return {Product}
     */
    getById(id) {
        return storage.get(id);
    }

    /**
     * Load data from a CSV
     * @param path the path to the local file
     * @return {Promise<number>} the number of items in the storage
     */
    loadFromCsv(path) {
        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(path)) {
                    return reject('File not found');
                }
                fcsv.fromPath(path, {headers: true, ignoreEmpty: true, delimiter: ';'})
                    .transform((data) =>
                        new Product(data.id, data.title, data.gender_id, data.composition, data.sleeve, data.photo, data.url)
                    )
                    .on("data", (product) =>
                        storage.add(product.id, product)
                    )
                    .on("end", () => resolve(storage.getTotal())
                    );
            } catch (ex) {
                reject(ex);
            }
        });
    }

    suggestByColor(product, limit) {
        return [];
    }

}

module.exports = new Manager();