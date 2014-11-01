
A router that is only concerned with single-page apps that want to change state based on the bits of the url after the hash.

[![browser support](https://ci.testling.com/TehShrike/hash-brown-router.png)](https://ci.testling.com/TehShrike/hash-brown-router)

## To use

	var makeRouter = require('hash-brown-router')

	var router = makeRouter()

## To add routes

	router.add('/page/:pageName', function(parameters) {
		console.log(parameters.pageName)
	})

Parses [express-style](https://forbeslindesay.github.io/express-route-tester/) route paths, using a fork of [path-to-regexp](https://github.com/pillarjs/path-to-regexp).

## To evaluate the first route

	router.go('/home')

Forces the library to evaluate the current route from location.hash.  Probably best do do once the [dom is ready](https://www.npmjs.org/package/domready).

If location.hash is currently empty, it sets it to the value you pass in.

## Default/404 route

	router.setDefault(function(path, parameters) {
		console.log("you went to", path, "but that doesn't go anywhere, I guess you just end up here")
	})

## Other

### stop()

If for some reason you want the router to start ignoring hash change events. you can call `route.stop()`.

License
======

[WTFPL](http://wtfpl2.com)
