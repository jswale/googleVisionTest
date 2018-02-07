var express = require('express');
var bodyParser = require('body-parser');

/**
 * The server.
 *
 * @class Server
 */
class Server {

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        //create expressjs application
        this.app = express();
        //configure application
        this.config();
        //configure routes
        this.routes();
    }

    /**
     * Configure the application
     *
     * @class Server
     * @method config
     * @return void
     */
    config() {
        //disable for security issue
        this.app.disable('x-powered-by');
        //mount json form parser
        this.app.use(bodyParser.json());
        //mount query string parser
        this.app.use(bodyParser.urlencoded({ extended: true }));

        // catch 404 and forward to error handler
        this.app.use(function (err, req, res, next) {
            var error = new Error("Not Found");
            err.status = 404;
            next(err);
        });
    }

    /**
     * Configure the routes
     *
     * @class Server
     * @method routes
     * @return void
     */
    routes() {
        this.app.use('/', require('./routes/index.route'));
        this.app.use('/admin', require('./routes/admin.route'));
        this.app.use('/api', require('./routes/api.route'));
        this.app.use('/doc', express.static(__dirname + '/../www/doc'));
    }
}

module.exports = new Server().app;
