# httpsnode

A https server for web development. It generate and use self signed SSL Certificates. It also have some cool delivery features. 

## Motivation

One day to test all standalone webservers with all simple features i need, or code it. I coded it.


## **Command Line Usage**


> You can use `httpsnode` as a standalone webserver.

#### Install
```
$ npm install -g httpsnode
```

#### Run
> Go into the directory you want to serve (having an index.html file), then just type
```
$ httpsnode
config: use config file [...]
server: start listening on 192.168.1.36:8443
server: ready
```

#### Options
```
$ httpsnode
Usage: httpsnode [options]

Instant self signed certificate https web server for developer.

Options:
  -V, --version                         output the version number
  -d, --document-root <documentRoot>    DocumentRoot (default: "./")
  -l, --listening-port <listeningPort>  Listening port (default: 8443)
  -i, --interface <regexpInterface>     Network interface filter (regular expression)
  -b, --browser                         Open the browser (default: false)
  -c, --config-file <configFile>        Path to /path/to/myhttpsnodeconfig.json (default ./.httpsnode.json)
  -h, --help                            display help for command
```

#### Optional config file

> When starting, the process try to read `./httpsnode.json` in the current directory or in specified `--config-file` directory config option.



## **Programmatical usage (nodejs)**

> You can use `httpsnode` programmatically.


#### Install
```
$ npm install httpsnode
```

#### Minimal js code

```
const Server = require( 'httpsnode' );
const serverInstance = new Server();
serverInstance.start();
```


#### With a config object

```
const Server = require( 'httpsnode' );

const config = {

    documentRoot: './',
    listeningPort: 8443,
    regexpInterface: /wi-fi|eth0/i,
    browser: true,
    //features:{
    // see #Features
    //}
};

const serverInstance = new Server( config );

serverInstance.start();
```

## **Features**

> **v1.0.0 - 02/18/2022**
* [x] Client redirects
* [x] Url rewriting
* [x] Static webserver with content rewriting

> **v1.1.0 - 02/18/2022**
* [x] Static webserver with content rewriting using query string variable


#### Features config

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


## **Use with npm**

> npm install then add start script in your `package.json`
```
  "scripts": {
    "start": "node node_modules/httpsnode/bin/httpsnode.js -d ."
  },
```
then
```
$ npm start
config: use config file [...]
server: start listening on [...]
server: ready
```


## **Roadmap**


* [ ] Network level throttling
* [ ] Access log
* [ ] Systemd install process



## Debugging

> Set env var `DEBUG` with any value i.e `DEBUG=* httpsnode`.
