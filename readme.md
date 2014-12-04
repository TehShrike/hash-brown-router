
A router that is only concerned with single-page apps that want to change state based on the bits of the url after the hash.

[![Build Status](https://travis-ci.org/TehShrike/hash-brown-router.svg)](https://travis-ci.org/TehShrike/hash-brown-router)

## To use

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

## `replace(newPath)` - replace the current route in the browser history

	router.add('/page/:pageName', function(parameters) {
		if (doesNotExistInTheDatabase(parameters.pageName)) {
			router.replace('/pageNotFound')
		}
	})

Convenience method for `location.replace(location.origin + location.pathname + '#' + newPath)`.

## `evaluateCurrent(defaultPath)` - evaluate the current url

Forces the library to evaluate the current route from location.hash.  Probably best do do once the [dom is ready](https://www.npmjs.org/package/domready).

	router.evaluateCurrent('/home')

If location.hash is currently empty, it changes the path to the default path value you pass in.

## Other

### `stop()`

If for some reason you want the router to start ignoring hash change events. you can call `route.stop()`.

License
======

[WTFPL](http://wtfpl2.com)
