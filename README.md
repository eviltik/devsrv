# **devsrv**

A nodejs http(s) server for web development with some cool features. 

## **Motivation**

How many dats to test all standalone webservers npm module with all simple features i'm looking for, vs time to code it. I coded it.

## **Changelog**

> **v1.0.0 - 02/18/2022**
* [x] Add: use HTTPS with generated self signed SSL certificates by default
* [x] Add: client redirects handler
* [x] Add: url rewriting handler (proxy)
* [x] Add: static content webserver with content rewriting
* [x] Add: open web browser option

> **v1.1.0 - 02/18/2022**
* [x] Add: static webserver with content rewriting using query string variable

> **v1.3.0 - 02/18/2022**
* [x] Add: detect Codesandbox, then use http rather than https, because of Codesandbox reverse proxy ssl termination

> **v1.3.1 - 02/21/2022**
* [x] Change: code refactor
* [x] Change: change config file name 
* [x] Add: explorer (directory listing)
* [x] Add: npm build script (releases static files, serverless provider compliant i.e vercel )

## **Roadmap**
* [ ] CI tests
* [ ] Network level throttling (simulate slow network for testing)
* [ ] Access log
* [ ] Systemd template
* [ ] Websocket proxy ?
* [ ] WebRTC ?


## **Command Line Usage**

> You can use `devsrv` as a standalone webserver.

#### Install
```
$ npm install -g devsrv
```

#### Run
> Go into the directory you want to serve (having an index.html file), then just type
```
$ devsrv
config: use config file [...]
server: start listening on 192.168.1.36:8443
server: ready
```

#### Options
```
$ devsrv
Usage: devsrv [options]

Instant self signed certificate https web server for developer.

Options:
  -V, --version                         output the version number
  -d, --document-root <documentRoot>    DocumentRoot (default: "./")
  -l, --listening-port <listeningPort>  Listening port (default: 8443)
  -i, --interface <regexpInterface>     Network interface filter (regular expression)
  -o, --open                            Open the browser on start (default: false)
  -b, --build                           Trigger build process
  -c, --config-file <configFile>        Path to /path/to/mydevsrvconfig.json (default ./.devsrv.json)
  -h, --help                            display help for command
```

#### Optional config file

> When starting, the process try to read `./.devsrv.json` in the current directory or in specified `--config-file` directory config option.



## **Programmatical usage (nodejs)**

> You can use `devsrv` programmatically.


#### Install
```
$ npm install devsrv
```

#### Minimal js code

```
const Server = require( 'devsrv' );
const serverInstance = new Server();
serverInstance.start();
```


#### With a config object

```
const Server = require( 'devsrv' );

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


#### Features config

> You can specify theses options if the `config` object.


```
{
    "documentRoot": "./",
    "listeningPort": 8443,
    "interfaceRegexp": "/wi-fi|eth0/i",
    "openBrowser": true,
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
            "replaceRegexp":"THREEJSVERSION",
            "defaultValue":"0.119",
            "pathRegexp":"(\\.(html|js))|(\\/)$"
        }
    ],
    "buildOptions": {
        "src":"./tests",
        "dst":"./dist/v1.0.0/threejs-r119",
        "replaceRegexp":"THREEJSVERSION",
        "defaultValue":"0.119",
        "pathRegexp":"\\.(html|js)$"
    }

}
```


## **Use with npm**

> `npm install devsrv` then add start script in your `package.json`
```
  "scripts": {
    "start": "node node_modules/devsrv/bin/devsrv.js -d ."
  },
```
then
```
$ npm start
config: use config file [...]
server: start listening on [...]
server: ready
```

## Debugging

> Set env var `DEBUG` with any value i.e `DEBUG=* devsrv`.
