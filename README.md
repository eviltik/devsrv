# https-server


## Nodejs instant self signed certificate https server

This webserver use created self signed SSL Certificates.

!! Warning: for development environment only !!

--------

>## Command line context

> ### Install
```
$ npm install -g https-server
```

> ### Run
Go into the directory you want to server (having an index.html file), then just type
```
$ https-server -b
```

> ### Options
```
$ https-server
Usage: https-server [options]

Instant self signed certificate https web server.

Options:
  -V, --version                         output the version number
  -d, --document-root <documentRoot>    DocumentRoot (default: "./")
  -l, --listening-port <listeningPort>  Listening port (default: 8443)
  -i, --interface <regexpInterface>     Network interface filter (regular expression)
  -b, --browser                         Open the browser (default: false)
  -h, --help                            display help for command

```

> ## Programmatically (nodejs)

> ### Install
```
$ npm install https-server
```

> ### Run

```
const Server = require( 'https-server' );

const config = {

    documentRoot: './',
    listeningPort: 8443,
    regexpInterface: /wi-fi|eth0/i,
    browser: true

};


const serverInstance = new Server( config );

serverInstance.start();
```
