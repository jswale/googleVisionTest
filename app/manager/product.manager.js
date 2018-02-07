const fs = require('fs');
const fcsv = require('fast-csv');
const gcVision = require('@google-cloud/vision');
const colourProximity = require('colour-proximity');
const config = require('../helpers/config');
const utils = require('../helpers/utils');
const logger = require('../helpers/logger');
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

    save(product) {
        storage.add(product.id, product);
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
                    .on("data", (product) => this.save(product))
                    .on("end", () => resolve(storage.getTotal())
                    );
            } catch (ex) {
                reject(ex);
            }
        });
    }

    /**
     * Suggest a collection of products close to a product color
     *
     * @param product
     * @param limit
     * @return {Array}
     */
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
                    logger.warn(`Unable to perform proximity beetwen ${product.id} and ${other.id}`);
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
                    products.push({product: other, score: score});
                    // We need to sort the products by their scores
                    products.sort((a, b) => a.score - b.score);
                    // Retreive the new best score
                    best = products[products.length - 1];
                }
            });
        }
        return products.map(entry => entry.product);
    }

    getGCVClient() {
        if (!this._GCVClient) {
            this._GCVClient = new gcVision.ImageAnnotatorClient({
                keyFilename: config.get('credentials:googleCloud')
            });
        }
        return this._GCVClient;
    }

    async importColors(limit) {
        let noUpdated = 0;
        await storage.list().some(product => {
            // Stop updating products when limit is reached
            if (noUpdated === limit) {
                return true;
            }
            // Ignore product having a color
            if (product.color) {
                return false;
            }
            noUpdated++;
            this.importColor(product);
        });
        return noUpdated;
    }

    updateColor(product, color) {
        logger.debug(` > color set to ${product.id}`);
        product.color = '#' + utils.rgbToHexa(color.red, color.green, color.blue);
        this.save(product);
    }

    importColor(product) {
        logger.debug(`Updating color for ${product.toString()} with image http:${product.photo}`);
        return new Promise((resolve, reject) => {
            try {
                let client = this.getGCVClient();
                client.imageProperties(`http:${product.photo}`)
                    .then(results => {
                        if (results.length === 0) {
                            return reject("No result found from the api");
                        }
                        let result = results[0];
                        let colors = result.imagePropertiesAnnotation.dominantColors.colors;
                        // looks like the first color if the main one but in case let's sort the data to be sure
                        colors.sort((a, b) => {
                            return a.score - b.score;
                        });
                        let mainColor = colors[colors.length - 1];
                        this.updateColor(product, mainColor.color);
                        resolve();
                    })
                    .catch(error => {
                        console.log(error);
                        reject(error)
                    });
            } catch (ex) {
                reject(ex);
            }
        });

    }

}

module.exports = new Manager();