var loop = require('raf-loop')
var css = require('dom-css')
var touches = require('touches')
var input = require('./')({
  min: 0,        // min bound
  max: 1,        // max bound
  edge: 0.15,    // gutter size
  value: 0.5,    // initial value
  damping: 0.3,  // flick friction
  spring: 0.2    // "bounce back" friction
})

var width = 200
var padding = width * input.edge

var gutter = document.querySelector('.gutter')
var container = document.querySelector('.container')
var cursor = document.querySelector('.cursor')
var text = document.querySelector('.text')

css(gutter, 'width', width + padding * 2)

css(container, {
  width: width,
  left: padding
})

css(cursor, 'transform', 'translate(-50%, -50%)')

var dragging = false
touches(window, { target: container, filtered: true })
  .on('start', function (ev, pos) {
    dragging = true
    input.start(normalize(pos))
  })
  .on('move', function (ev, pos) {
    if (!dragging) return
    ev.preventDefault()
    input.move(normalize(pos))
  })
  .on('end', function (ev, pos) {
    dragging = false
    input.end(normalize(pos))
  })

function normalize (pos) {
  return pos[0] / width
}

loop(function () {
  input.update()
  var x = input.value * width
  css(cursor, 'left', x)
  text.innerText = input.value.toFixed(2)
}).start()
