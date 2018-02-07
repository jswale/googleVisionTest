"use strict";

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
    }

    toString() {
        return `#${this.id}`;
    }
}
module.exports = Product;
