const fs = require('fs');
const fcsv = require('fast-csv');
const colourProximity = require('colour-proximity');
const logger = require('../helpers/Logger');
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
        let products = [];

        // The product have a recorded color
        if (product.color) {
            let best = undefined;
            storage.list().some(other => {
                // Ignore if same product
                if (other.id === product.id) {
                    return false;
                }
                // Ignore if the other product dont have a color
                if (!other.color) {
                    return false;
                }

                // A lower number means a better score
                let score;
                try {
                    score = colourProximity.proximity(product.color, other.color);
                } catch (ex) {
                    logger.warn(`Unable to perform proximity beetwen ${product} and ${other}`);
                    return false;
                }

                let addEntry = false;
                if (products.length < limit) {
                    addEntry = true;
                } else if (score < best) {
                    addEntry = true;
                    // We need to do remove the last entry (the baddest one)
                    products.pop();
                }

                if (addEntry) {
                    products.push({p: other, s: score});
                    // We need to sort the products by their scores
                    products.sort((a, b) => a.s - b.s);
                    // Retreive the new best score
                    best = products[products.length - 1];
                }
            });
        }
        return products.map(entry => entry.p.id);
    }

}

module.exports = new Manager();