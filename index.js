#!/usr/bin/env node

/**
 * Module dependencies.
 ***/
var program = require('commander');
var pack = require('./package.json');
var shell = require('shelljs');

program
  .version(pack.version)
  .description('Limits meteor processes CPU usage')
  .option('-t, --time <n>', 'Time in seconds to scan. Defaults to 20')
  .option('-c, --cpu <n>', 'Percentage of cpu allowed from 0 to 800. Defaults to 50')
  .parse(process.argv);

var process_limiting = [];

process.on('uncaughtException', function(err){
  console.log("Err: ", err);
});

// Find Meteor Processes
var findProcesses = function(){
  console.log("Finding processes...");
  var cmd = "ps ax | grep node | grep meteor | grep -v meteor-limiter | grep -v grep | awk '{print $1}'";
  var wait_secs = parseInt(program.time) || 20;
  var cpu_limit = parseInt(program.cpu) || 50;

  if(process_limiting.length > 0 ) {
    console.log("Currently limited "+process_limiting.length+" processes");
  }

  var child = shell.exec(cmd, function(code, stdout, stderr) {
    //console.log('Exit code:', code);
    //console.log('Program output:', stdout);
    //console.log('Program stderr:', stderr);
    var pid = parseInt(stdout);
    //console.log(typeof pid);
    if(pid === "" || isNaN(pid)) {
      console.log("No process found, will try again in "+wait_secs+"s");
    } else if(process_limiting.indexOf(pid) === -1) {
      console.log("Process found with pid: ", pid);
      var limiter = "cpulimit --p "+pid+" --limit "+cpu_limit+" ";
      console.log(limiter);
      process_limiting.push(pid);
      meteorLimiter(limiter, pid, wait_secs);
    }
    setTimeout(findProcesses, 1000*wait_secs);
  });
}

// Limiter
var meteorLimiter = function(limiter, pid, wait_secs){
  var child_process = shell.exec(limiter, {async:true});

  child_process.stdout.on('data', function(data) {
    //console.log("Data: ", data);
  });

  child_process.stderr.on('data', function(data) {
    console.log("Err: ", data);
  });

  child_process.on('close', function(code) {
    console.log('Limiting pid ended: ', pid, ' with code ', code);
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

