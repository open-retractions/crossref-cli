var querystream = require('rest-collection-stream')
var through = require('through2')
var pumpify = require('pumpify')
var xtend = require('xtend')
var ProgressBar = require('progress')

var API_URL = 'https://api.crossref.org/works'

module.exports = function (args, opts) {
  if (args.filter && args.filter instanceof Array) {
    args.filter = args.filter.join(',')
  }

  var n = 0
  var progress
  var query = xtend({
    cursor: '*',
    rows: (args.limit && args.limit < 1000) ? args.limit : 1000,
    filter: args.filter
  })

  if (query.limit) {
    delete query.limit
    doProgress()
  }

  return pumpify.obj(resultstream(), logstream())

  function resultstream () {
    console.error('Querying CrossRef with:', query)
    return querystream(API_URL, {
      qs: query,
      data: getdata,
      next: getnext
    })
  }

  function logstream () {
    return through.obj(logone, done)
  }

  function getdata (res, body) {
    handleErrors(res, body)
    if (opts.progress) doProgress(body)
    var items = body.message.items
    if ( items.length === 0 ) {
      console.log('Completed query.\n')
      process.exit()
    }
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
    } else if (opts.progress) {
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

  function logone (data, enc, done) {
    if (opts.log) console.log(JSON.stringify(data))
    done(null, data)
  }

  function done(cb) {
    console.error('')
    console.error('Successfully retrieved', n, 'entries from CrossRef')
    cb()
  }
}
