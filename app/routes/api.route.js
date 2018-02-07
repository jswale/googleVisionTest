var express = require('express');
var utils = require('../helpers/utils');
var productManager = require('../manager/product.manager');

var router = express.Router();

/**
 * API to retreive a product detail
 *
 * @api {get} /product/:id Display the product detail
 * @apiName ProductDetail
 * @apiGroup Product
 *
 * @apiParam {String} id The id of the product
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:9090/product/L1212-00-KC8
 *
 * @apiSuccess {String} id Id of the Product
 * @apiSuccess {String} title Title of the Product
 * @apiSuccess {String} gender Gender of the Product
 * @apiSuccess {String} composition Composition of the Product
 * @apiSuccess {String} sleeve Sleeve of the Product
 * @apiSuccess {String} photo Photo of the Product
 * @apiSuccess {String} url Url of the Product
 * @apiSuccess {String} color Main color of the Product
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
     *    "id": "L1212-00-KC8",
     *    "title": "Polo Lacoste L.12.12 uni",
     *    "gender": "MAN",
     *    "composition": "100% Coton",
     *    "sleeve": "Manches courtes",
     *    "photo": "//image1.lacoste.com/dw/image/v2/AAQM_PRD/on/demandware.static/Sites-FR-Site/Sites-master/default/L1212_KC8_24.jpg?sw=458&sh=443",
     *    "url": "https://www.lacoste.com/fr/lacoste/homme/vetements/polos/polo-lacoste-l.12.12-uni/L1212-00.html?dwvar_L1212-00_color=KC8",
     *    "color": "#FF46F3"
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
 * @api {get} /product/:id/suggest/color/:limit Retrieve a list of suggestion
 * @apiName ProductSuggestion
 * @apiGroup Product
 *
 * @apiParam {String} id The id of the product
 * @apiParam {number} limit The number of products wanted in return
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:9090/product/L1212-00-KC8/suggest/color/1
 *
 * @apiSuccess {Object} product The source product
 * @apiSuccess {String} product.id Id of the Product
 * @apiSuccess {String} product.title Title of the Product
 * @apiSuccess {String} product.gender Gender of the Product
 * @apiSuccess {String} product.composition Composition of the Product
 * @apiSuccess {String} product.sleeve Sleeve of the Product
 * @apiSuccess {String} product.photo Photo of the Product
 * @apiSuccess {String} product.url Url of the Product
 * @apiSuccess {String} product.color Main color of the Product
 *
 * @apiSuccess {Object[]} suggestions List of matching products
 * @apiSuccess {String} suggestions.id Id of the Product
 * @apiSuccess {String} suggestions.title Title of the Product
 * @apiSuccess {String} suggestions.gender Gender of the Product
 * @apiSuccess {String} suggestions.composition Composition of the Product
 * @apiSuccess {String} suggestions.sleeve Sleeve of the Product
 * @apiSuccess {String} suggestions.photo Photo of the Product
 * @apiSuccess {String} suggestions.url Url of the Product
 * @apiSuccess {String} suggestions.color Main color of the Product
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 * "product" : {
     *    "id": "L1212-00-KC8",
     *    "title": "Polo Lacoste L.12.12 uni",
     *    "gender": "MAN",
     *    "composition": "100% Coton",
     *    "sleeve": "Manches courtes",
     *    "photo": "//image1.lacoste.com/dw/image/v2/AAQM_PRD/on/demandware.static/Sites-FR-Site/Sites-master/default/L1212_KC8_24.jpg?sw=458&sh=443",
     *    "url": "https://www.lacoste.com/fr/lacoste/homme/vetements/polos/polo-lacoste-l.12.12-uni/L1212-00.html?dwvar_L1212-00_color=KC8",
     *    "color": "#FF46F3"
     * },
     * "suggestions": [ {
     *    "id": "L1212-00-KC9",
     *    "title": "Polo Lacoste L.12.13 uni",
     *    "gender": "MAN",
     *    "composition": "100% Coton",
     *    "sleeve": "Manches courtes",
     *    "photo": "//image1.lacoste.com/dw/image/v2/AAQM_PRD/on/demandware.static/Sites-FR-Site/Sites-master/default/L1212_KC8_25.jpg?sw=458&sh=443",
     *    "url": "https://www.lacoste.com/fr/lacoste/homme/vetements/polos/polo-lacoste-l.12.12-uni/L1212-00.html?dwvar_L1211-00_color=KC8",
     *    "color": "#FF46F5"
     * }]
 *
 * @apiError {String} error Reason
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Reason"
 *     }
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

    let limit = utils.toInt(request.params.limit) || 10;
    if (limit < 0) {
        return utils.responseError(response, 400, 'argument "limit" must be a positive number');
    }

    let products = productManager.suggestByColor(product, limit);

    utils.responseSuccess(response, {product: product, suggestions: products});
}

router.get('/product/:id', productDetail);
router.get('/product/:id/suggest/color/:limit', productSuggestByColor);

module.exports = router;
