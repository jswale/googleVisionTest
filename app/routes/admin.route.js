var express = require('express');
var utils = require('../helpers/utils');
var productManager = require('../manager/product.manager');

var router = express.Router();

/**
 * API to retreive a product detail
 *
 * @api {get} /product/import/csv?path=:path Import product from CSV
 * @apiName LoadCSV
 * @apiGroup Admin
 *
 * @apiParam {String} path The path of the local file
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:9090/product/import/csv?path=/tmp/data.csv
 *
 * @apiSuccess {Number} total The number of products in the storage
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
     *    "total": 10
     * }
 *
 * @apiError {String} error Reason
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Reason"
 *     }
 */
function importProductFromCsv(request, response, next) {
    let path = request.query.path;
    if (!path) {
        return utils.responseError(response, 400, 'mandatory query argument named "Path"');
    }

    productManager.loadFromCsv(path)
        .catch(reason => utils.responseSuccess(response, {"total": total}))
        .catch(reason => utils.responseError(response, 400, reason));
}

/**
 * API to import the main colors of the products
 *
 * @api {get} /product/import/colors Import product colors
 * @apiName LoadColors
 * @apiGroup Admin
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:9090/product/import/colors
 *
 * @apiSuccess {Boolean} success true if import succeed
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
     *    "success": true
     * }
 *
 * @apiError {String} error Reason
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Reason"
 *     }
 */
function importProductColors(request, response, next) {
    let limit = utils.toInt(request.query.limit) || 1;
    if (limit < 0) {
        return utils.responseError(response, 400, 'argument "limit" must be a positive number');
    }

    productManager.importColors(limit)
        .catch(reason => utils.responseSuccess(response, {"success": true}))
        .catch(reason => utils.responseError(response, 400, reason));

}

router.get('/product/import/csv', importProductFromCsv);
router.get('/product/import/colors', importProductColors);

module.exports = router;
