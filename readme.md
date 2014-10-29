
A router that is only concerned with single-page apps that want to change state based on the bits of the url after the hash.

## To use

	var makeRouter = require('hash-brown-router')

	var router = makeRouter()

## To add routes

	router.add('/page/:pageName', function(parameters) {
		console.log(parameters.pageName)
	})

Parses [express-style](https://forbeslindesay.github.io/express-route-tester/) route paths, using a fork of [path-to-regexp](https://github.com/pillarjs/path-to-regexp).

## Default route

	router.setDefault(function(path) {
		console.log("you went to", path, "but that doesn't go anywhere, I guess I'll send you somewhere else")
	})

## Other

	To force the routing library to evaluate the current route once your JavaScript is done loading (probably once the [dom is ready](https://www.npmjs.org/package/domready)), call `router.go()`.

	If for some reason you want the router to start ignoring hash change events. you can call `route.stop()`.

License
======

[WTFPL](http://wtfpl2.com)
