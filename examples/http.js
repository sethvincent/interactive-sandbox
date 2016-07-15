var createSandbox = require('../index')
var local = require('wzrd-bundler/local-module')

var code = `var bunny = require('bunny')
var request = require('xhr')


request('http://boundaries.seattle.io/boundaries', function (err, res, body) {
  console.log(body)
  var div = document.createElement('div')
  div.innerHTML = body
  document.body.appendChild(div)
})
`

var sandbox = createSandbox(code, {
  // modules: {
  //   xhr: local('xhr')
  // }
})

document.body.appendChild(sandbox.render())
