var express = require('express');
var utils = require('../helpers/utils');
var productManager = require('../manager/product.manager');

var router = express.Router();

/**
 * API to import data from a local CSV
 *
 * @param request
 * @param response
 * @param next
 */
function importProductFromCsv(request, response, next) {
    let path = request.query.path;
    if (!path) {
        return utils.responseError(response, 400, 'mandatory query argument named "Path"');
    }

    productManager.loadFromCsv(path)
        .catch(reason => utils.responseSuccess(response, {"success": total}))
        .catch(reason => utils.responseError(response, 400, reason));
}

/**
 * API to import the main colors of the products
 * @param request
 * @param response
 * @param next
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
