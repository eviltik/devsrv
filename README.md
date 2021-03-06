# **devsrv**

A nodejs http(s) server for web development with some cool features. 

## **Motivation**

How many days to test all standalone webservers npm module with all simple features i'm looking for, vs time to code it. I coded it.

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
  -a, --access-log                      Enable access Log
  -e, --explorer                        Directory listing (default: false)
  -l, --listening-port <listeningPort>  Listening port (default: 8443)
  -i, --interface <interfaceRegexp>     Network interface filter (regular expression)
  -o, --open-browser                    Open the browser (default: false)
  -m, --monitor-changes                 Monitor file changes and reload webpage (default: false)
  -c, --config-file <configFile>        Configuration file (default: "./devsrv.config.js")
  -b, --build                           trigger build process (default: false)
  --build-dst <buildDst>                build dist directory (default: "./dist/1.0.0/")
  --build-src <buildSrc>                build src directory (default: "./public")
  -h, --help                            display help for command

```

#### Optional config file

> When starting, the process try to read `./.devsrv.js` in the current directory or in specified `--config-file` directory config option.



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
const config = {
    documentRoot: './tests',
    interfaceRegexp: /wi-fi|eth0/i,
    openBrowser: true,
    clientRedirects:[
        {
            urlSrc:'/',
            redirectTo:'/tests/index.html'
        }
    ],
    urlRewrites: [
        {
            urlSrcRegexp:/^\/tests2/,
            replaceWith:'/tests'
        }
    ],
    textReplacements: [
        {
            queryVar:'r',
            queryVarRegexp:/^0\.[0-9]{3}$/,
            replaceRegexp:/THREEJSVERSION/g,
            defaultValue:'0.119',
            pathRegexp:/\.(html|js)|(\/)$/
        }
    ],
    monitorOptions:{
        enable:false,
        directories:[ './' ],
        fileRegexp:/\.(html|jsm?)$/,
        excludeRegexp: /node_modules/
    }
};

module.exports = config;

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

## Build process

`devsrv -b` will trigger build process. You can add this in `devsrv.config.js`:
```
"buildOptions": {
        "src":"./tests",
        "dst":"./dist/v1.0.0/threejs.119",
        "replaceRegexp":"THREEJSVERSION",
        "defaultValue":"0.119",
        "fileRegexp":"\\.(html|js)$"
    }
```

* remove dst directory if already exists
* copy files from src directory into dst directory (recursive), 
* find files match regexp `fileRegexp`, then replace string in file using `replaceRegexp` with value `defaultValue`

## Monitor changes

`devsrv -m` will monitor `documentRoot` recursively and we send an event to the browser 
each time a file or directory has changed. The browser use a SSE client to receive the event.

Under the wood, `fs.watch` is used. In tests/index.html you will find the peace of 
code to use to handle Server Side Event Events ("reload" event only).

```
monitorOptions:{
    enable:false,
    directories:[ './' ],
    fileRegexp:/\.(html|jsm?)$/,
    excludeRegexp: /node_modules/
}
```

## Debugging

> Set env var `DEBUG` with any value i.e `DEBUG=* devsrv`.


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

> **v1.4.0 - 02/23/2022**
* [x] Add: monitor file changes and reload web page, no websocket but Server Side Events (SSE)
* [x] Add: simple access log

> **v1.4.1 - 02/23/2022**
* [x] Fix: check config before start monitoring file changes
* [x] Add: simple access log

> **v1.4.2 - 02/24/2022**
* [x] Fix: use session to store query var value

> **v1.5.0 - 03/01/2022**
* [x] Add: monitor options, see #1
* [x] Add: js config file, see #2

> **v1.5.1 - 03/02/2022**
* [x] Fix package version pb

> **v1.5.1 - 03/02/2022**
* [x] More delay for file changes

## **Roadmap**
* [ ] CI tests
* [ ] Network level throttling (simulate slow network for testing) ?
* [ ] Systemd template ?
* [ ] Websocket proxy ?
* [ ] WebRTC ?

