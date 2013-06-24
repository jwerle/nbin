nbin
====

execute local bin files in a module

[![Build Status](https://travis-ci.org/jwerle/nbin.png)](https://travis-ci.org/jwerle/nbin)

## install

```js
$ [sudo] npm install nbin -g
```

## usage

`nbin(1)` allows you to execute the `bin` files found in `node_modules/.bin` from the command line without having to type the path explicitly

```sh
$ nbin mocha mocha -a "\-R spec"


  nbin(dir)
    ✓ should accept a valid module directory and read from the `./node_modules/.bin` directory
    nbin(dir).exec(bin, args)
      ✓ should execute a given `bin` and return a stream


  2 passing (16 ms)
```

## api

`nbin` can be used via the command line executable or programmatically

### command line

`nbin(1)` accepts a `bin` name a single argument and will execute it and pipe back to `stdout` of the executing `tty`

```sh
$ npm install forever
$ nbin forever
help:    usage: forever [action] [options] SCRIPT [script-options]
help:
help:    Monitors the script specified in the current process or as a daemon
help:
help:    actions:
help:      start               Start SCRIPT as a daemon
help:      stop                Stop the daemon SCRIPT
help:      stopall             Stop all running forever scripts
help:      restart             Restart the daemon SCRIPT
help:      restartall          Restart all running forever scripts
help:      list                List all running forever scripts
help:      config              Lists all forever user configuration
help:      set <key> <val>     Sets the specified forever config <key>
help:      clear <key>         Clears the specified forever config <key>
help:      logs

...
```

you can start a daemon with `forever` using `nbin` from your local `node_modules` directory by using the `--args` flag

```sh
$ nbin forever --args "start bin/myapp"
warn:    --minUptime not set. Defaulting to: 1000ms
warn:    --spinSleepTime not set. Your script will exit if it does not stay up for at least 1000ms
info:    Forever processing file: bin/myapp
```

you can stop it the same way too

```sh
$ nbin forever --args "stop bin/myapp"
```

*NOTE:* you must escape certain characters like `-` with `\-` so arguments are passed properly

#### ls

list all bins found in your module

```sh
$ nbin ls

  cwd: /Users/jwerle/repos/nbin
  .bin: /Users/jwerle/repos/nbin/node_modules/.bin

    o _mocha (/Users/jwerle/repos/nbin/node_modules/.bin/_mocha)
    o mocha (/Users/jwerle/repos/nbin/node_modules/.bin/mocha)
```

### programmatic

`nbin` can be used programmatically too.

#### nbin(dir)

* `dir` - module directory

***example***

```js
var mods = nbin(__dirname)

console.log(mods.bins); // ['mocha', 'forever']
```

#### .nbin(dir).exec(bin, args)

execute a `bin` on a given module directory with an optional arguments array and returns a stream

* `bin` - bin to execute
* `args` - (optional) array of arguments to pass to executed `bin`

```js
var stream = nbin(__dirname).exec('mocha')

stream.on('data', function (chunk) {
  // do something with chunk
});

stream.on('error', function () {
  // handle error
});
```

## license

MIT