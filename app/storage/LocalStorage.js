const fs = require('fs');
const config = require('../helpers/config');
const utils = require('../helpers/utils');
const logger = require('../helpers/logger');

class LocalStorage {

    constructor(persistenceKey) {
        this.clear();
        this.persistenceKey = persistenceKey;
        this.initFromPersistence();
    }

    getPersistenceFile() {
        return config.get(`persistence:${this.persistenceKey}:file`);
    }

    initFromPersistence() {
        if (!this.persistenceKey) {
            return;
        }

        let file = this.getPersistenceFile();
        if (!file) {
            this._persistence = false;
            logger.warn(`No persistence defined`);
            return false;
        } else {
            this._persistence = true;
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
        if (!this._persistence) {
            // No persistence, nothing to do
            return;
        }

        this.waitAndSave();
    }

    waitAndSave() {
        if (!this._persistenceTask) {
            this._persistenceTask = setTimeout(() => {
                // Remove the task
                this._persistenceTask = null;
                // wait to the current task to end
                if (this._persistenceInProgress) {
                    this.waitAndSave();
                } else {
                    this._persistenceInProgress = true;
                    this.persist().then(() => {
                        this._persistenceInProgress = false
                    }).catch(reason => {
                        console.log(reason)
                    })
                }
            }, 250);
        }
    }

    persist() {
        return new Promise((resolve, reject) => {
            let file = this.getPersistenceFile();
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