'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Normalize a port into a number, string, or false.
 *
 * @param val
 * @return {*}
 */
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Convert to integer
 *
 * @param value
 * @return {*}
 */
function toInt(value) {
    if (!value) {
        return null;
    }
    value = parseInt(value, 10)
    return isNaN(value) ? null : value;
}

/**
 * Generate a response for an error
 *
 * @param response
 * @param status
 * @param reason
 */
function responseError(response, status, reason) {
    response.status(status);
    responseJson(response, {reason: reason});
}

/**
 * Generate a response for a success request
 * @param response
 * @param data
 */
function responseSuccess(response, data) {
    responseJson(response, data);
}

/**
 * Generate a response for a json object
 * @param response
 * @param json
 */
function responseJson(response, json) {
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify(json, null, 2));
}

// convert 0..255 R,G,B values to a hexidecimal color string
function rgbToHexa(r, g, b) {
    var bin = r << 16 | g << 8 | b;
    return ((h) => new Array(7 - h.length).join("0") + h)(bin.toString(16).toUpperCase())
}

function generateColor() {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}

function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}


module.exports = {normalizePort, toInt, rgbToHexa, responseError, responseSuccess, generateColor, ensureDirectoryExistence};
