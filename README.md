# DevServer : an enhanced https server for developement.


This webserver generate and use self signed SSL Certificates. It also have some cool delivery features.
  

**!! Warning: for development environment only !!**


----------
## **Command Line Usage**
----

> You can use `devserver` as a standalone webserver.

## Install
```
$ npm install -g devserver
```

## Run
> Go into the directory you want to serve (having an index.html file), then just type
```
$ devserver
config: use config file [...]
server: start listening on 192.168.1.36:8443
server: ready

```

## Options
```
$ devserver
Usage: devserver [options]

Instant self signed certificate https web server for developer.

Options:
  -V, --version                         output the version number
  -d, --document-root <documentRoot>    DocumentRoot (default: "./")
  -l, --listening-port <listeningPort>  Listening port (default: 8443)
  -i, --interface <regexpInterface>     Network interface filter (regular expression)
  -b, --browser                         Open the browser (default: false)
  -c, --config-file <configFile>        Path to /path/to/mydevserverconfig.json (default ./.devserver.json)
  -h, --help                            display help for command

```

## Optional config file

> When starting, the process try to read `./devserver.json` in the current directory or in specified `--config-file` directory config option.


----------
## **Programmatical usage (nodejs)**
-----
> You can use `devserver` programmatically.


## Install
```
$ npm install devserver
```

## Minimal code

```
const DevServer = require( 'devserver' );
const devServerInstance = new DevServer();
devServerInstance.start();
```


## with config object

```
const DevServer = require( 'devserver' );

const config = {

    documentRoot: './',
    listeningPort: 8443,
    regexpInterface: /wi-fi|eth0/i,
    browser: true,
    //features:{
    // see #Features
    //}
};


const devServerInstance = new DevServer( config );

devServerInstance.start();
```
----------
## **Features**
----------

> v1.0.0 - 02/18/2022
* [x] Client redirects
* [x] Url rewriting
* [x] Static webserver with content rewriting

> v1.1.0 - 02/18/2022
* [x] Static webserver with content rewriting using query string variable


> You can specify theses options if the `config` object.


```
{
    "documentRoot": "./",
    "listeningPort": 8443,
    "interfaceRegexp": "/wi-fi|eth0/i",
    "browser": true,
    "clientRedirects":[
        {
            "urlSrc":"/",
            "redirectTo":"/tests/index.html"
        }
    ],
    "urlRewrites": [
        {
            "urlSrcRegexp":"^/test2",
            "replaceBy":"/test"
        }
    ],
    "textReplacements": [
        {
            "queryVar":"r",
            "queryVarRegexp":"^0\\.[0-9]{3}$",
            "replaceRegexp":"DEVSERVER_THREEJSVERSION",
            "defaultValue":"0.135",
            "pathRegexp":"(\\.(html|js))|(\\/)$"
        }
    ]
}
```

----------
## **Use with npm, vercel compliant**
----------
> package.json
```
  "scripts": {
    "start": "node node_modules/devserver/bin/devserver.js -d ."
  },
```
then
```
$ npm start
config: use config file [...]
server: start listening on 192.168.1.36:8443
server: ready

```


----------
## **Roadmap**
----------

* [ ] Network level throttling
* [ ] Access log
* [ ] Systemd install process


----------
## Debugging
----------
> Set env var `DEBUG` with any value i.e `DEBUG=* devserver`.
