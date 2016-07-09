# hash-brown-router

A router that is only concerned with single-page apps that want to change state based on the bits of the url after the hash.

## Why another client-side routing library?

This library:

1. uses a path-parsing library that lets you [generate links programmatically](https://github.com/tehshrike/page-path-builder#usage)
2. comes with a handy stub for testing - any library that takes hash-brown-router can use the included [stub](#testability) in unit tests.

# API

## Construction

```js
var makeRouter = require('hash-brown-router')

var router = makeRouter(options)
```

- `options`: an object of options
	- `reverse`: By default, routes are matched from oldest to newest. So if there are multiple matching routes for the current url, the first one that was added is used.  If `reverse` is set to `true`, then the most recently added match is used.

The router is an event emitter that emits:

- `not found`: whenever the route is evaluated and there is no matching handler for that route.  It is passed two arguments: the path (a string) and the querystring parameters (an object).

## `router.add(routeString, cb)` - add routes

```js
router.add('/page/:pageName', function(parameters) {
	console.log(parameters.pageName)
})
```

Parses [express-style](https://forbeslindesay.github.io/express-route-tester/) route paths, using a fork of [path-to-regexp](https://github.com/pillarjs/path-to-regexp).

## `router.location.go(newPath)` - navigate to a new path

```js
router.location.go('/some-other/path')
```

Changes the current location hash.

## `router.location.replace(newPath)` - replace the current route in the browser history

```js
router.add('/page/:pageName', function(parameters) {
	if (doesNotExistInTheDatabase(parameters.pageName)) {
		router.location.replace('/pageNotFound')
	}
})
```

Changes the current location hash, replacing the last location in the browser history, i.e. `location.replace(location.origin + location.pathname + '#' + newPath)`.

## `router.location.get()` - get the current path, without a leading hash

```js
router.location.get() // => '/page/home'
```

## `router.evaluateCurrent(defaultPath)` - evaluate the current url

Forces the library to evaluate the current route from location.hash.  Probably best do do once the [dom is ready](https://www.npmjs.org/package/domready).

```js
router.evaluateCurrent('/home')
```

If location.hash is currently empty, it changes the path to the default path value you pass in.

## `router.stop()`

If for some reason you want the router to start ignoring hash change events. you can call `router.stop()`.

# Testability

Want to use a stub of this library that works in node?  Just `require('hash-brown-router/mock')` for all your automated testing needs.

# Browser support

[![Build Status](https://travis-ci.org/TehShrike/hash-brown-router.svg)](https://travis-ci.org/TehShrike/hash-brown-router)

Automated testing in Chrome, Firefox, Safari, and IE9+ provided by [Browserstack](https://www.browserstack.com/).

# License

[WTFPL](http://wtfpl2.com)
