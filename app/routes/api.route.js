var express = require('express');
var utils = require('../helpers/utils');
var productManager = require('../manager/product.manager');

var router = express.Router();

/**
 * API to retreive a product detail
 *
 * @param request
 * @param response
 * @param next
 */
function productDetail(request, response, next) {
    let id = request.params.id;
    if (!id) {
        return utils.responseError(response, 400, 'mandatory query argument named "id"');
    }

    let product = productManager.getById(id);
    if (!product) {
        return utils.responseError(response, 400, `unknown product ${id}`);
    }
    utils.responseSuccess(response, product);
}

router.get('/product/:id', productDetail);

module.exports = router;
