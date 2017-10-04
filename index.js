var fs = require('fs')
var path = require('path')
var html = require('yo-yo')
var css = require('dom-css')
var insertcss = require('insert-css')
var codemirror = require('codemirror')
require('codemirror/mode/javascript/javascript')
var createBundler = require('wzrd-bundler')
var debounce = require('lodash.debounce')
var createIframe = require('create-iframe')

module.exports = function createSandbox (content, options) {
  options = options || {}
  options.editor = options.editor || {}
  options.bundler = options.bundler || {}
  var input = html`<div class="interactive-sandbox-input" onload=${onloadInput}></div>`
  var output = html`<div class="interactive-sandbox-output" onload=${onloadOutput}></div>`
  var onChange = options.onChange || function () {}
  var bundler = createBundler(options.bundler)
  var sandbox = {}
  var iframe

  function onloadInput (el) {
    editor.setValue(content)
  }

  function onloadOutput (el) {
    iframe = createIframe('', { container: output })
  }

  insertcss(fs.readFileSync(path.join(__dirname, 'css', 'codemirror.css'), 'utf8'))

  if (!options.editor.theme) {
    insertcss(fs.readFileSync(path.join(__dirname, 'css', 'tomorrow-night.css'), 'utf8'))
  }

  css(input, {
    width: options.editor.width || '100%',
    height: options.editor.height,
    backgroundColor: '#333'
  })

  if (options.hideOutput) {
    css(output, {
      display: 'none'
    })
  }

  options.editor.autofocus = true
  options.editor.mode = options.editor.mode || 'javascript'
  options.editor.theme = options.editor.theme || 'tomorrow-night'
  var editor = codemirror(input, options.editor)

  function run () {
    bundler(editor.getValue(), options.modules, function (err, bundle, packages) {
      output.removeChild(iframe.iframe)
      iframe = createIframe(bundle, { container: output })
    })
  }

  var debounced = debounce(run, 300)

  editor.on('change', function (data) {
    debounced()
    onChange(editor.getValue())
  })

  function render () {
    setTimeout(function () {
      editor.refresh()
    }, 0)

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
