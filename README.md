# googleVisionTest
The goal of this project is to play with the [Google Vision API](https://cloud.google.com/vision) by managing a list or products and searching for the nearest other products by color. REST API are provided to interact with the application.

## Requirements

* Nodejs 8.+
* Npm
* A Google Cloud Platform account

## Configuration

The application can deal with two configurations files. The `config.default.json` used for default values, and the `config.json` where the specific options related to your environment have to be set. All the options defined in the default file can be overrided by the other.

Here are the options :
* **webserver:port** `number` port number of the web server (default to `9090`)
* **credentials:googleCloud** `string` path to the file containing the credentials of your Google Cloud Account
* **persistence:product:file** : `string` the path of the file to persist data (default `./data/products.data.json`). If no file is specified, the persistence is desactivated. 


## Run procedure

Before starting the web server, you have to create the `config.json` file as describe previously.

Go to the project folder and launch

`npm install && npm start`
