var querystream = require('rest-collection-stream')
var to = require('flush-write-stream')
var pumpify = require('pumpify')
var xtend = require('xtend')
var ProgressBar = require('progress')

var API_URL = 'http://api.crossref.org/v1/works'

module.exports = function (args, opts) {
  if (args.filter && args.filter instanceof Array) {
    args.filter = args.filter.join(',')
  }

  var n = 0
  var progress
  var query = xtend({
    cursor: '*',
    rows: (args.limit && args.limit < 1000) ? args.limit : 1000
  }, args)

  if (query.limit) {
    delete query.limit
    doProgress()
  }

  return pumpify(resultstream(), logstream())

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
    if (opts.progress) doProgress(body)
    var items = body.message.items
    n += items.length
    return items
  }

  function getnext (res, body) {
    if (args.limit && args.limit <= n) return
    var cursor = body.message['next-cursor']
    return cursor ? { cursor: cursor } : null
  }

  function doProgress (body) {
    if (progress) {
      progress.tick(body.message.items.length)
    } else {
      progress = new ProgressBar('Results downloaded: :percent :bar (:current/:total)', {
        width: 100,
        total: args.limit || body.message['total-results']
      })
    }
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
    if (opts.log) console.log(JSON.stringify(data))
    cb(null, data)
  }

  function done(cb) {
    console.error('')
    console.error('Successfully retrieved', n, 'entries from CrossRef')
    cb()
  }
}
