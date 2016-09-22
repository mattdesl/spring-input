var clamp = require('clamp')
var defined = require('defined')

module.exports = createSpringInput
function createSpringInput (opt) {
  return new SpringInput(opt)
}

function SpringInput (opt) {
  opt = opt || {}

  this.velocity = 0
  this.lastInput = 0
  this.interacting = false
  this.inputDelta = 0

  this.value = opt.value || 0
  this.min = opt.min || 0
  this.max = defined(opt.max, 1)
  this.edge = opt.edge || 0
  this.damping = defined(opt.damping, 0.3)
  this.spring = defined(opt.spring, 0.2)
  this.maxVelocity = defined(opt.maxVelocity, 0.01)
}

SpringInput.prototype.update = function () {
  var isBefore = this.value < this.min
  var isAfter = this.value > this.max
  var dipping = !this.interacting
  var dip = 0

  // ease input at edges
  if (isBefore) {
    this.velocity *= 1 - this.spring
    if (this.inputDelta < 0 && this.edge !== 0) {
      this.inputDelta *= 1 - Math.abs(this.value - this.min) / this.edge
    }
  } else if (isAfter) {
    this.velocity *= 1 - this.spring
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
  if (!this.interacting) {
    this.value += this.velocity
  }
  this.velocity *= 1 - this.damping
  this.value -= dip
  this.value = clamp(this.value, this.min - this.edge, this.max + this.edge)
}

SpringInput.prototype.start = function (value) {
  this.interacting = true
  this.velocity = 0
  this.inputDelta = 0
  this.lastInput = value
}

SpringInput.prototype.move = function (value) {
  if (this.interacting) {
    var delta = value - this.lastInput
    // avoid getting out of sync when user is at gutter
    if (this.value + delta > this.max + this.edge) {
      value = Math.min(value, this.max + this.edge)
    }
    if (this.value + delta < this.min - this.edge) {
      value = Math.max(value, this.min - this.edge)
    }
    this.inputDelta = delta
    this.lastInput = value

    // clamp to max velocity
    var maxVelocity = Math.abs(this.maxVelocity)
    if (this.inputDelta < 0) {
      this.velocity = Math.max(this.velocity + this.inputDelta, -maxVelocity)
    } else if (this.inputDelta > 0) {
      this.velocity = Math.min(this.velocity + this.inputDelta, maxVelocity)
    }
  }
}

SpringInput.prototype.end = function () {
  this.interacting = false
}
