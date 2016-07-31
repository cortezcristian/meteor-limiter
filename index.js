#!/usr/bin/env node

/**
 * Module dependencies.
 ***/
var program = require('commander');
var pack = require('./package.json');
var shell = require('shelljs');

program
	.version(pack.version)
  .option('-i, --intercept', 'Listen for new processes to limit')
  .parse(process.argv);

if (program.init !== ''){
   // check cpulimit availability
   if (!shell.which('cpulimit')) {
      shell.echo('Sorry, this script requires cpulimit');
			shell.echo('Please install it:');
			shell.echo('$ brew install cpulimit');
			shell.echo('$ apt-get install cpulimit');
      shell.exit(1);
   }
}

