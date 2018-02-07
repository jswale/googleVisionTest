var express = require('express');

var router = express.Router();

/**
 * The homepage
 * @param request
 * @param response
 * @param next
 */
function index(request, response, next) {
    response.send(`Server is online`);
}

router.get('/', index);

module.exports = router;
