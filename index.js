var fs = require('fs')
var path = require('path')
var html = require('yo-yo')
var css = require('dom-css')
var insertcss = require('insert-css')
var codemirror = require('codemirror')
require('codemirror/mode/javascript/javascript')
var createBundler = require('wzrd-bundler')
var debounce = require('lodash.debounce')
var makeIframe = require('make-iframe')

module.exports = function createSandbox (content, options) {
  options = options || {}
  options.editor = options.editor || {}
  options.bundler = options.bundler || {}
  var input = html`<div class="interactive-sandbox-input" onload=${onloadInput}></div>`
  var output = html`<div class="interactive-sandbox-output" onload=${onloadOutput}></div>`
  var bundler = createBundler()
  var sandbox = {}
  var iframe

  function onloadInput (el) {
    editor.setValue(content)
  }

  function onloadOutput (el) {
    iframe = makeIframe('', { container: output })
  }

  insertcss(fs.readFileSync(path.join(__dirname, 'css', 'codemirror.css')))
  insertcss(fs.readFileSync(path.join(__dirname, 'css', 'tomorrow-night.css')))

  css(input, {
    width: options.width || '100%',
    height: options.width || 400,
    backgroundColor: '#333'
  })

  var editor = codemirror(input, {
    autofocus: true, 
    mode: options.editor.mode || 'javascript', 
    theme: options.editor.theme || 'tomorrow-night'
  })

  function run () {
    bundler(editor.getValue(), options.modules, function (err, bundle, packages) {
      output.removeChild(iframe.iframe)
      iframe = makeIframe(bundle, { container: output })
    })
  }

  var debounced = debounce(run, 300)

  editor.on('change', function (data) {
    debounced()
  })

  function render () {
    return html`
     <div class="interactive-sandbox">
     ${input}
     ${output}
     </div>
     `
  }

  sandbox.render = render
  sandbox.editor = editor
  sandbox.bundler = bundler
  return sandbox
}
