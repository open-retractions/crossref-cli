#! /usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))

delete argv._

if (argv.h || argv.help) {
  require('./help')()
} else {
  require('./query')(argv)
}
