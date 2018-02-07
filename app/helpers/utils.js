'use strict';

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
    onJson(response, {reason: reason});
}

/**
 * Generate a response for a success request
 * @param response
 * @param data
 */
function responseSuccess(response, data) {
    onJson(response, {data: data});
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

module.exports = {normalizePort, toInt, responseError, responseSuccess};
