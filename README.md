# devserver


## Nodejs self signed certificate instant https server for developer

This webserver generate/use self signed SSL Certificates. It also have some minimalists web application server features 
* client redirects
* url rewriting
* content rewriting
  

!! Warning: for development environment only !!

--------

>## Local usage (CLI)

> ### Install
```
$ npm install -g devserver
```

> ### Run
Go into the directory you want to server (having an index.html file), then just type
```
$ devserver
```

> ### Options
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

> ## Programmatical usage (nodejs)

> ### Install
```
$ npm install devserver
```

> ### Minimal setup

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

## Features

* [x] Client redirects
* [x] Url rewriting
* [x] Static webserver with content rewriting using query string variable

You can specify theses options if the `config` object.


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

## Optional config file location

When starting, the process try to read `./devserver.json` in the current directory or in specified `--config-file` directory

## Debugging

set env var `DEBUG` with any value

