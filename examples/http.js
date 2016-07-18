var createSandbox = require('../index')
var local = require('wzrd-bundler/local-module')

var code = `var html = require('yo-yo')
var request = require('xhr')

request('http://boundaries.seattle.io/boundaries', function (err, res, body) {
  console.log(body)
  var content = html\`<p>\${body}</p>\`
  document.body.appendChild(content)
})
`

var sandbox = createSandbox(code, {
  // modules: {
  //   xhr: local('xhr')
  // }
})

document.body.appendChild(sandbox.render())
