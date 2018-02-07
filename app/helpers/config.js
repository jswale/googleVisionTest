const nconf = require('nconf');
const utils = require('./utils');

class Config {
    constructor() {
        nconf.argv().env();
        nconf.file('default', './config.default.json');
        nconf.file('env', './config.json');
    }

    get(key) {
        return nconf.get(key);
    }

    getPort() {
        return utils.normalizePort(this.get('webserver:port'));
    }
}

module.exports = new Config();