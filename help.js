module.exports = function () {
  var path = require('path')
  var pjson = require('./package.json')
  console.log(
    'crossref-cli',
    '(v' + pjson.version + ')',
    ' - a command-line interface for querying the crossref works API'
  )
  console.log('arguments:')
  console.log('    --limit <number> - sets the maximum number of records to get')
  process.exit(0)
}
