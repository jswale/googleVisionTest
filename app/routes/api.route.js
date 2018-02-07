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

/**
 * API to retreive a list or product with a similar color
 *
 * @param request
 * @param response
 * @param next
 */
function productSuggestByColor(request, response, next) {
    let id = request.params.id;
    if (!id) {
        return utils.responseError(response, 400, 'mandatory query argument named "id"');
    }

    let product = productManager.getById(id);
    if (!product) {
        return utils.responseError(response, 400, `unknown product ${id}`);
    }

    let limit = utils.toInt(request.query.limit) || 10;
    if (limit < 0) {
        return utils.responseError(response, 400, 'argument "limit" must be a positive number');
    }

    let products = productManager.suggestByColor(product, limit);

    utils.responseSuccess(response, products);
}

router.get('/product/:id', productDetail);
router.get('/product/:id/suggest/color', productSuggestByColor);

module.exports = router;
