# googleVisionTest
The goal of this project is to play with the [Google Vision API](https://cloud.google.com/vision) by managing a list of products. Some REST API are provided to inject, retrieve and search products.

## Requirements

* Nodejs 8.+
* Npm
* A Google Cloud Platform account

## Configuration

The application handles two configuration files. The `config.default.json` used for default values, and the `config.json` for the options related to your environment. All the options defined in the default file can be overridden.

The options are:
* **webserver:port** `number` port number of the web server (default to `9090`)
* **credentials:googleCloud** `string` path to the file containing the credentials of your Google Cloud Account
* **persistence:product:file** : `string` the path to the file to persist data (default `./data/products.data.json`). If no file is specified, the persistence is deactivated. 


## Run procedure

Before starting the web server, you have to create the `config.json` file as described previously.

Go to the project folder and launch

`npm install && npm start`

## API

The documentation of the APIs is generated from the source code using the [apiDOC](http://apidocjs.com) by running the command 

`npm run-script build`

The documentation is generated in the folder `www/doc` and is available on [http://localhost:9090/doc/](http://localhost:9090/doc/) when the web server is online