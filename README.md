# spring-input

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

A utility to provide a springy mouse and touch input, similar to bouncy scroll panels in iOS. This can be used in a variety of applications, such as scrolling, rotating a 3D camera, flicking a 2D card, etc.

Demo:

http://mattdesl.github.io/spring-input/

<img src="http://i.imgur.com/KDYz1eW.png" width="70%" />

Adapted from [touch-scroll-physics](https://github.com/Jam3/touch-scroll-physics/), which is more application-specific than this module.

## Install

```sh
npm install spring-input --save
```

## Example

See [test.js](./test.js) for a full example.

```js
var createSpring = require('spring-input')

// e.g. a slider along the x-axis
var spring = createSpring({
  min: 0,        // min bound
  max: 1,        // max bound
  edge: 0.1,     // gutter size
  value: 0.5,    // initial value
  damping: 0.25, // flick friction
  spring: 0.15   // "bounce back" friction
})

function onDragStart (x, y) {
  spring.start(x)
}

function onDragMove (x, y) {
  spring.move(x)
}

function onDragEnd (x, y) {
  spring.end(x)
}

function onRequestAnimationFrame () {
  spring.update()
}
```

This is a low-level module, intended to be used with your own input handling and update loop. This can be easily combined with the following modules:

- [touches](https://github.com/Jam3/touches) - unified mouse / touch input and drag events
- [mouse-wheel](http://npmjs.com/package/mouse-wheel) - cross-browser mouse wheel events
- [raf-loop](https://www.npmjs.com/package/raf-loop) - a simple requestAnimationFrame loop

## Usage

[![NPM](https://nodei.co/npm/spring-input.png)](https://www.npmjs.com/package/spring-input)

#### `spring = createSpring([opt])`

Creates a new sprint input with the optional settings:

- `value` - the initial value, default 0
- `min` - the minimum bound, default 0 (can be `-Infinity`)
- `max` - the maximum bound, default 1 (can be `Infinity`)
- `edge` - the relative edge gutter size, default 0 (i.e. no "bounce back")
- `damping` - adjusts the friction when flicking; defualt 0.1
- `spring` - adjusts the friction when bouncing back; default 0.1

All values can be changed during runtime, eg:

```js
spring.max = newScrollHeight
```

#### `spring.start(value)`

Initiates user input with the specified `value`, such as the X mouse position.

#### `spring.move(value)`

Initiates a user "move" event with the specified `value`.

#### `spring.end()`

Stops user input, which allows the value to be integrated and roll into place.

#### `spring.update()`

Integrates the spring. Should be called once per animation loop.

## See Also

- [touch-scroll-physics](https://github.com/Jam3/touch-scroll-physics/) very similar, but more application-specific

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/spring-input/blob/master/LICENSE.md) for details.
