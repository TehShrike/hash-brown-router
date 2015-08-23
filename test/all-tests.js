var makeRouter = require('../')
var test = require('tape')

module.exports = function tests(locationHash, delayAfterInitialRouteChange) {
	function getRoute(cb, options) {
		locationHash.go('')
		setTimeout(function() {
			var router = options ? makeRouter(options, locationHash) : makeRouter(locationHash)
			cb(router)
		}, delayAfterInitialRouteChange || 0)
	}

	test('routing on a simple url', function(t) {
		t.timeoutAfter(4000)
		getRoute(function(route) {
			route.add('/non-butts', function() {
				t.fail('the wrong route was called')
			})

			route.add('/butts', function() {
				route.stop()
				t.pass('the correct route was called')
				t.end()
			})

			route.setDefault(function() {
				t.fail('the default route was called')
			})

			locationHash.go('/butts')
		})
	})

	test('default function is called when nothing matches', function(t) {
		getRoute(function(route) {
			var fail = t.fail.bind(t, 'the wrong route was called')

			route.add('/butts', fail)
			route.add('/non-butts', fail)

			route.setDefault(function(path) {
				t.pass('the default route was called')
				t.equal('/lulz', path, 'the default path was passed in')
				route.stop()
				t.end()
			})

			locationHash.go('/lulz')
		})

		t.timeoutAfter(4000)
	})

	test('evaluating the current path instead of waiting for an onhashchange', function(t) {
		t.timeoutAfter(4000)

		getRoute(function(route) {
			locationHash.go('/butts')

			setTimeout(function() {
				t.plan(1)

				route.add('/non-butts', function() {
					t.fail('the wrong route was called')
				})

				route.add('/butts', function() {
					t.pass('the correct route was called')
				})

				route.setDefault(function() {
					t.fail('the default route was called')
				})

				// may not always want the route to fire in the same tick?
				route.evaluateCurrent()

				route.stop()

				t.end()
			}, 1000)
		})
	})

	test('matching an express-style url, getting parameters back', function(t) {
		getRoute(function(route) {
			route.add('/no/way', t.fail.bind(t, 'the wrong route was called'))

			route.add('/my/:special', function(parameters) {
				t.equal(typeof parameters, 'object', 'parameters object is an object')
				t.equal(Object.keys(parameters).length, 1, 'parameters object has one property')
				t.equal(parameters.special, 'input')
				route.stop()
				t.end()
			})

			locationHash.go('/my/input')
		})

		t.timeoutAfter(4000)
	})

	test('route.evaluateCurrent calls the default route when the current path is empty', function(t) {
		getRoute(function(route) {

			route.add('/default', function() {
				t.pass('the default route was called')
				t.equal(locationHash.get(), '/default', 'the hash was set to the default from the route.evaluateCurrent call')
				route.stop()
				t.end()
			})
			route.add('/other', t.fail.bind(t, 'the wrong route was called'))

			route.evaluateCurrent('/default')
		})

		t.timeoutAfter(4000)
	})

	test('route.evaluateCurrent does not call the default route when the current path is not empty', function(t) {
		getRoute(function(route) {
			locationHash.go('/starting-path')

			route.add('/default', t.fail.bind(t, 'the default route was called incorrectly'))
			route.add('/starting-path', function() {
				t.pass('the correct route was called')
				route.stop()
				t.end()
			})

			setTimeout(function() {
				route.evaluateCurrent('/default')
			}, 100)
		})

		t.timeoutAfter(4000)
	})

	test('parameters include values from querystring', function(t) {
		getRoute(function(route) {
			route.add('/myroute/:fromUrl', function(parameters) {
				t.equal(typeof parameters, 'object', 'parameters object is an object')
				t.equal(Object.keys(parameters).length, 2, 'parameters object has two properties')
				t.equal(parameters.fromUrl, 'value1', 'Value from the url parameter is correct')
				t.equal(parameters.fromQueryString, 'value2', 'Value from the query string is correct')
				route.stop()
				t.end()
			})

			locationHash.go('/myroute/value1?fromQueryString=value2')
		})
		t.timeoutAfter(4000)
	})

	test('parameters from route overwrite querystring parameters', function(t) {
		getRoute(function(route) {
			route.add('/myroute/:fromUrl', function(parameters) {
				t.equal(typeof parameters, 'object', 'parameters object is an object')
				t.equal(Object.keys(parameters).length, 1, 'parameters object has one property')
				t.equal(parameters.fromUrl, 'value1', 'Value is from the route parameter')
				route.stop()
				t.end()
			})

			locationHash.go('/myroute/value1?fromUrl=value2')
		})

		t.timeoutAfter(4000)

	})

	test('querystring parameters passed to the default route', function(t) {
		getRoute(function(route) {

			route.setDefault(function(path, parameters) {
				t.equal(typeof parameters, 'object', 'parameters object is an object')
				t.equal(parameters.lol, 'wut', 'value from the querystring was passed in')
				t.equal(path, '/default', 'the /default path was correctly passed in')

				route.stop()
				t.end()
			})

			route.evaluateCurrent('/default?lol=wut')
		})

		t.timeoutAfter(4000)
	})

	test('replacing a url', function(t) {
		getRoute(function(route) {
			route.add('/initial', shouldHappenOnce('initial route', function() {
				route.go('/redirect')
			}))

			route.add('/redirect', shouldHappenOnce('redirect route', function() {
				route.replace('/destination')
			}))

			route.add('/destination', shouldHappenOnce('destination route', function() {
				t.pass('it got here I guess')
				route.stop()
				t.end()
			}))

			route.setDefault(t.fail.bind(t, 'default route called'))

			route.go('/initial')

		})

		t.timeoutAfter(4000)

		function shouldHappenOnce(name, cb) {
			var happened = false
			return function() {
				if (happened) {
					t.fail(name + ' already happened once')
				} else {
					t.pass(name + ' happened')
					happened = true
				}
				cb && cb.apply(null, arguments)
			}
		}

	})

	test('by default, routes are evaluated oldest-to-newest', function(t) {
		getRoute(function(route) {
			route.add('/route/:oneThing', function() {
				t.pass('the first route was called')
				route.stop()
				t.end()
			})

			route.add('/route/:anotherThing', function() {
				t.fail('the second route was called')
			})

			setTimeout(function() {
				locationHash.go('/route/butts')
			}, 50)

		})

		t.timeoutAfter(4000)
	})

	test('routes can be evaluated newest-to-oldest', function(t) {
		getRoute(function(route) {

			route.add('/route/:oneThing', function() {
				t.fail('the first route was called')
				route.stop()
				t.end()
			})

			route.add('/route/:anotherThing', function() {
				t.pass('the second route was called')
				route.stop()
				t.end()
			})

			setTimeout(function() {
				locationHash.go('/route/butts')
			}, 50)

		}, { reverse: true })

		t.timeoutAfter(4000)
	})
}
