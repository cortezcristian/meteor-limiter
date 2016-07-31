# meteor-limiter
Meteor CPU limiter

This utility may help you reduce all the fan noise coming out from the machine, when running meteor projects.

## Usage

```bash
$ meteor-limiter -t 10 -c 77
```

This command will check for new processes every 10 seconds, and the max cpu percentage limit is set to 77.


## Installation

```bash
$ npm install -g meteor-limiter
```

You'll need to install [cpulimit](https://github.com/opsengine/cpulimit).

```bash
$ [sudo] apt-get install cpulimit # Ubuntu
$ brew install cpulimit # OSX
```

Other solution can be configuring vagrant provisioning and [vagrant-meteor](https://github.com/Sanjo/vagrant-meteor).
