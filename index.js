var fs = require('fs')
var path = require('path')
var html = require('yo-yo')
var css = require('dom-css')
var insertcss = require('insert-css')
var codemirror = require('codemirror')
require('codemirror/mode/javascript/javascript')
var moduleBundler = require('browser-module-sandbox')
var createEmitter = require('namespace-emitter')
var debounce = require('lodash.debounce')

module.exports = function createSandbox (content, options) {
  options = options || {}
  options.editor = options.editor || {}
  options.bundler = options.bundler || {}
  var iframe = document.createElement('iframe')
  var input = html`<div class="interactive-sandbox-input" onload=${onload}></div>`
  var output = html`<div class="interactive-sandbox-output"></div>`
  var sandbox = createEmitter()

  function onload (el) {
    editor.setValue(content)
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

  var bundler = moduleBundler({
    name: options.name,
    cdn: options.cdv || 'http://wzrd.in',
    container: output,
    iframe: iframe
  })

  bundler.on('bundleEnd', function (data) {
    console.log('bundler bundleEnd')
  })

  function run () {
    console.log('run')
    bundler.bundle(editor.getValue())
  }

  var debounced = debounce(run, 250)

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
