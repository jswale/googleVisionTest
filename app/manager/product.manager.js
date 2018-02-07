const fs = require('fs');
const fcsv = require('fast-csv');
const Product = require('../domain/Product.domain');
const storage = require('../storage/product.storage');

class Manager {

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

}

module.exports = new Manager();