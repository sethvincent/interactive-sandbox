var createSandbox = require('../index')

var code = `var request = require('xhr')

request('http://boundaries.seattle.io/boundaries', function (err, res, body) {
  console.log(err, res, body)
  document.write(body)
})
`

var sandbox = createSandbox(code)

document.body.appendChild(sandbox.render())
