const fs = require('fs');
const config = require('../helpers/config');
const utils = require('../helpers/utils');
const logger = require('../helpers/logger');

class LocalStorage {

    constructor(persistanceKey) {
        this.clear();
        this.persistanceKey = persistanceKey;
        this.initFromPersistance();
    }

    getPersistanceFile() {
        return config.get(`persistance:${this.persistanceKey}:file`);
    }

    initFromPersistance() {
        if (!this.persistanceKey) {
            return;
        }

        let file = this.getPersistanceFile();
        if (!file) {
            this._persistance = false;
            logger.warn(`No persistance defined`);
            return false;
        } else {
            this._persistance = true;
        }

        if (!fs.existsSync(file)) {
            logger.debug(`Unable to locate file ${file}`);
            return false;
        }

        let data;
        try {
            data = fs.readFileSync(file);
        } catch (ex) {
            logger.warn(`Fail loading file ${file}`, {error: ex.message});
            return false;
        }

        try {
            this.datas = JSON.parse(data);
        } catch (ex) {
            logger.warn(`Fail parsing data from file ${file}`, {error: ex.message});
            return false;
        }
    }

    clear() {
        this.datas = {};
    }

    dataChanged() {
        if (!this._persistance) {
            // No persistance, nothing to do
            return;
        }

        this.waitAndSave();
    }

    waitAndSave() {
        if (!this._persistanceTask) {
            this._persistanceTask = setTimeout(() => {
                // Remove the task
                this._persistanceTask = null;
                // wait to the current task to end
                if (this._persistanceInProgress) {
                    this.waitAndSave();
                } else {
                    this._persistanceInProgress = true;
                    this.persist().then(() => {
                        this._persistanceInProgress = false
                    }).catch(reason => {
                        console.log(reason)
                    })
                }
            }, 250);
        }
    }

    persist() {
        return new Promise((resolve, reject) => {
            let file = this.getPersistanceFile();
            utils.ensureDirectoryExistence(file);
            fs.writeFile(file, JSON.stringify(this.datas), (err) => {
                err ? reject(err) : resolve();
            })
        });
    }

    add(key, value) {
        this.datas[key] = value;
        this.dataChanged();
    }

    remove(key) {
        delete this.datas[key];
        this.dataChanged();
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