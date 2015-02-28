# hash-brown-router

A router that is only concerned with single-page apps that want to change state based on the bits of the url after the hash.

## Why another client-side routing library?

This library:

1. uses a path-parsing library that lets you [generate links programmatically](https://github.com/tehshrike/page-path-builder#usage)
2. comes with a handy stub for testing - any library that takes hash-brown-router can use the included [stub](#testability) in unit tests.

# API

## Construction

	var makeRouter = require('hash-brown-router')

	var router = makeRouter()

## `add(routeString, cb)` - add routes

	router.add('/page/:pageName', function(parameters) {
		console.log(parameters.pageName)
	})

Parses [express-style](https://forbeslindesay.github.io/express-route-tester/) route paths, using a fork of [path-to-regexp](https://github.com/pillarjs/path-to-regexp).

## `setDefault(cb)` - set a default/404 route

	router.setDefault(function(path, parameters) {
		console.log("you went to", path, "but that doesn't go anywhere, I guess you just end up here")
	})

Called whenever the hash route changes, but no other matching route is found.

## `go(newPath)` - navigate to a new path

	router.go('/some-other/path')

Changes the current location hash.

## `replace(newPath)` - replace the current route in the browser history

	router.add('/page/:pageName', function(parameters) {
		if (doesNotExistInTheDatabase(parameters.pageName)) {
			router.replace('/pageNotFound')
		}
	})

Changes the current location hash, replacing the last location in the browser history, i.e. `location.replace(location.origin + location.pathname + '#' + newPath)`.

## `evaluateCurrent(defaultPath)` - evaluate the current url

Forces the library to evaluate the current route from location.hash.  Probably best do do once the [dom is ready](https://www.npmjs.org/package/domready).

	router.evaluateCurrent('/home')

If location.hash is currently empty, it changes the path to the default path value you pass in.

## `stop()`

If for some reason you want the router to start ignoring hash change events. you can call `router.stop()`.

# Testability

Want to use a stub of this library that works in node?  Just `require('hash-brown-router/mock')` for all your automated testing needs.

[![Build Status](https://travis-ci.org/TehShrike/hash-brown-router.svg)](https://travis-ci.org/TehShrike/hash-brown-router)

# License

[WTFPL](http://wtfpl2.com)
