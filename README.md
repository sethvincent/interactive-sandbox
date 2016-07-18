# interactive-sandbox

Create interactive code examples for the browser that bundle modules from npm.

## Install

```
npm install --save interactive-sandbox
```

## Usage

Simple example:

```js
var createSandbox = require('interactive-sandbox')

var code = `var html = require('yo-yo')
var request = require('xhr')

request('http://boundaries.seattle.io/boundaries', function (err, res, body) {
  console.log(body)
  var content = html\`<p>\${body}</p>\`
  document.body.appendChild(content)
})
`

var sandbox = createSandbox(code)

document.body.appendChild(sandbox.render())
```

## License
[MIT](LICENSE.md)
