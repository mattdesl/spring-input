var clamp = require('clamp')
var defined = require('defined')
var newArray = require('new-array')

module.exports = createSpringInput
function createSpringInput (opt) {
  return new SpringInput(opt)
}

function SpringInput (opt) {
  opt = opt || {}
  this.value = opt.value || 0
  this.momentum = 0

  this.min = opt.min || 0
  this.max = defined(opt.max, 1)
  this.edge = opt.edge || 0

  this.lastInput = 0
  this.interacting = false

  this.spring = defined(opt.spring, 0.1)

  this.inputDelta = 0
  this.inputDeltaIndex = 0
  this.damping = defined(opt.damping, 0.1)

  var history = defined(opt.history, 3)
  this.inputDeltas = newArray(history, 0)
}

SpringInput.prototype.update = function () {
  var isBefore = this.value < this.min
  var isAfter = this.value > this.max
  var dipping = !this.interacting
  var dip = 0

  // ease input at edges
  if (isBefore) {
    this.momentum = 0
    if (this.inputDelta < 0 && this.edge !== 0) {
      this.inputDelta *= 1 - Math.abs(this.value - this.min) / this.edge
    }
  } else if (isAfter) {
    this.momentum = 0
    if (this.inputDelta > 0 && this.edge !== 0) {
      this.inputDelta *= 1 - Math.abs(this.value - this.max) / this.edge
    }
  }

  // dip back to edge
  if (dipping) {
    if (isBefore) {
      dip = this.value - this.min
    } else if (isAfter) {
      dip = this.value - this.max
    }
    dip *= this.spring
  }

  // integrate
  this.value += this.inputDelta
  this.inputDelta = 0
  this.value += this.momentum
  this.momentum *= 1 - this.damping
  this.value -= dip
  this.value = clamp(this.value, this.min - this.edge, this.max + this.edge)
}

SpringInput.prototype.start = function (value) {
  this.interacting = true
  this.momentum = 0
  this.inputDelta = 0
  this.lastInput = value
}

SpringInput.prototype.move = function (value) {
  if (this.interacting) {
    this.momentum = 0

    var delta = value - this.lastInput
    if (this.value + delta > this.max + this.edge) {
      value = Math.min(value, this.max + this.edge)
    }
    if (this.value + delta < this.min - this.edge) {
      value = Math.max(value, this.min - this.edge)
    }
    this.inputDelta = delta
    this.inputDeltas[this.inputDeltaIndex] = this.inputDelta
    this.inputDeltaIndex = (this.inputDeltaIndex + 1) % this.inputDeltas.length
    this.lastInput = value
  }
}

SpringInput.prototype.end = function () {
  if (this.interacting) {
    this.interacting = false
    // the history can help correct very small movements
    // that might be interpreted in the wrong direction
    this.momentum = this.inputDeltas.reduce(function (a, b) {
      return Math.abs(a) > Math.abs(b) ? a : b
    }, 0)
    for (var i = 0; i < this.inputDeltas.length; i++) {
      this.inputDeltas[i] = 0
    }
  }
}
