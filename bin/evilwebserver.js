#!/usr/bin/env node
const config = require( '../src/config' );
const server = require( '../src/server' );

server.start( config );

