"use strict";

const utils = require('../helpers/utils');

class Product {
    constructor(id, title, gender, composition, sleeve, photo, url) {
        this.id = id;
        this.title = title;
        this.gender = gender;
        this.composition = composition;
        this.sleeve = sleeve;
        this.photo = photo;
        this.url = url;
        this.color = null;
        // TODO should by remove after debug
        //this.color = utils.generateColor();
    }

    toString() {
        return `#${this.id}`;
    }
}
module.exports = Product;
