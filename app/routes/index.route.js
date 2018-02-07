var express = require('express');

var router = express.Router();

/**
 * The homepage
 * @param request
 * @param response
 * @param next
 */
function index(request, response, next) {
    response.send(`Please refer to documentation at http://${request.headers.host}/doc`);
}

router.get('/', index);

module.exports = router;
