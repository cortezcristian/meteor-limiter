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

var process_limiting = [];

// Find Meteor Processes
var findProcesses = function(){
	var cmd = "ps ax | grep node | grep meteor | grep -v grep | awk '{print $1}'";
	var wait_secs = 20;

	var child = shell.exec(cmd, function(code, stdout, stderr) {
		console.log('Exit code:', code);
		console.log('Program output:', stdout);
		console.log('Program stderr:', stderr);
		if(stdout === "") {
			console.log("No process found, try again in "+wait_secs+"s");
			setTimeout(findProcesses, 1000*wait_secs);
		} else {
			var pid = stdout;
			console.log("Process found with pid: ", pid);
		}
	});
}

if (program.init !== ''){
	// check cpulimit availability
	if (!shell.which('cpulimit')) {
		shell.echo('Sorry, this script requires cpulimit');
		shell.echo('Please install it:');
		shell.echo('$ brew install cpulimit');
		shell.echo('$ apt-get install cpulimit');
		shell.exit(1);
	}

	findProcesses();

}

