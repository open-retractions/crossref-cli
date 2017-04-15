var querystream = require('rest-collection-stream')
var to = require('flush-write-stream')
var pumpify = require('pumpify')
var xtend = require('xtend')

var API_URL = 'http://api.crossref.org/v1/works'

var n = 0

module.exports = function (args) {
  if (args.filter && typeof args.filter === 'array') {
    args.filter = args.filter.join(',')
  }

  n = 0

  var query = xtend({ cursor: '*', rows: 1000 }, args)

  if (query.limit) delete query.limit

  pumpify(resultstream(), logstream())

  function resultstream () {
    console.error('Querying CrossRef with:', query)
    return querystream(API_URL, {
      qs: query,
      data: getdata,
      next: getnext
    })
  }

  function logstream () {
    return to.obj(logone, done)
  }

  function getdata (res, body) {
    handleErrors(res, body)
    var items = body.message.items
    n += items.length
    return items
  }

  function getnext (res, body) {
    if (args.limit && args.limit <= n) return
    var cursor = body.message['next-cursor']
    return cursor ? { cursor: cursor } : null
  }

  function handleErrors (res, body) {
    if (body.status === 'failed') {
      console.error('Received an error from the CrossRef API:')
      body.message.forEach(function (error) {
        console.error(error.message)
      })
      process.exit(1)
    }
  }

  function logone (data, enc, cb) {
    console.log(JSON.stringify(data))
    cb()
  }

  function done(cb) {
    console.error('Successfully retrieved', n, 'entries from CrossRef')
    cb()
  }
}
