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
        .then(total => utils.responseSuccess(response, {"success": total}))
        .catch(reason => utils.responseError(response, 400, reason));
}

router.get('/product/import/csv', importProductFromCsv);

module.exports = router;
