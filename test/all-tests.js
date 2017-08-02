var makeRouter = require('../')
var test = require('tape-catch')

module.exports = function tests(locationHash, delayAfterInitialRouteChange) {
	function getRoute(options) {
		return options ? makeRouter(options, locationHash) : makeRouter(locationHash)
	}

	function startTest(cb, startingLocation) {
		locationHash.go(startingLocation || '')
		setTimeout(function() {
			cb(getRoute)
		}, delayAfterInitialRouteChange || 0)
	}

	test('routing on a simple url', function(t) {
		t.timeoutAfter(4000)
		startTest(function(getRoute) {
			var route = getRoute()

			route.on('not found', function() {
				t.fail('"not found" was emitted')
			})

			route.add('/non-butts', function() {
				t.fail('the wrong route was called')
			})

			route.add('/butts', function() {
				route.stop()
				t.pass('the correct route was called')
				t.end()
			})

			locationHash.go('/butts')
		})
	})

	test('onNotFound is called when nothing matches', function(t) {
		startTest(function(getRoute) {
			var route = getRoute()

			route.on('not found', function(path) {
				t.pass('the default route was called')
				t.equal('/lulz', path, 'the default path was passed in')
				route.stop()
				t.end()
			})

			var fail = t.fail.bind(t, 'the wrong route was called')

			route.add('/butts', fail)
			route.add('/non-butts', fail)

			locationHash.go('/lulz')
		})

		t.timeoutAfter(4000)
	})

	test('evaluating the current path instead of waiting for an onhashchange', function(t) {
		t.timeoutAfter(4000)

		startTest(function(getRoute) {
			t.plan(1)

			locationHash.go('/butts')

			setTimeout(function() {
				var route = getRoute()

				route.on('not found', function() {
					t.fail('"not found" was emitted')
				})

				route.add('/non-butts', function() {
					t.fail('the wrong route was called')
				})

				route.add('/butts', function() {
					t.pass('the correct route was called')
					route.stop()
					t.end()
				})

				// may not always want the route to fire in the same tick?
				route.evaluateCurrent()
			}, 1000)
		})
	})

	test('matching an express-style url, getting parameters back', function(t) {
		startTest(function(getRoute) {
			var route = getRoute()

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
		startTest(function(getRoute) {
			var route = getRoute()

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
		startTest(function(getRoute) {
			var route = getRoute()

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

	test('route.evaluateCurrent calls onNotFound when the current path is invalid', function(t) {
		startTest(function(getRoute) {
			var route = getRoute()

			route.on('not found', function() {
				t.pass('"not found" was emitted')
				route.stop()
				t.end()
			})

			locationHash.go('/some-unhandled-path')

			route.add('/default', t.fail.bind(t, 'the default route was called incorrectly'))

			setTimeout(function() {
				route.evaluateCurrent('/default')
			}, 100)
		})

		t.timeoutAfter(4000)
	})

	test('parameters include values from querystring', function(t) {
		startTest(function(getRoute) {
			var route = getRoute()

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
		startTest(function(getRoute) {
			var route = getRoute()

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

	test('querystring parameters passed to onNotFound on evaluateCurrent', function(t) {
		startTest(function(getRoute) {
			var route = getRoute()

			route.on('not found', function(path, parameters) {
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

	test('evaluateCurrent works correctly when explicitly starting at route /', function(t) {
		startTest(function(getRoute) {
			var route = getRoute()

			route.on('not found', function(path, parameters) {
				t.equal(typeof parameters, 'object', 'parameters object is an object')
				t.equal(parameters.lol, 'wut', 'value from the querystring was passed in')
				t.equal(path, '/default', 'the /default path was correctly passed in')

				route.stop()
				t.end()
			})

			route.evaluateCurrent('/default?lol=wut')
		}, '/')

		t.timeoutAfter(4000)
	})

	test('replacing a url', function(t) {
		startTest(function(getRoute) {
			var route = getRoute()

			route.on('not found', t.fail.bind(t, 'onNotFound called'))

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
		startTest(function(getRoute) {
			var route = getRoute()

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
		startTest(function(getRoute) {
			var route = getRoute({ reverse: true })

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
		})

		t.timeoutAfter(4000)
	})

	test('encoding in hash fragment', function(t) {
		startTest(function(getRoute) {
			var route = getRoute({ reverse: true })

			route.add('/route/:oneThing', function(parameters) {
				t.equal(parameters.oneThing, 'thing with spaces')
				route.stop()
				t.end()
			})

			route.add('/other-route/:anotherThing', function() {
				t.fail('the second route was called')
				route.stop()
				t.end()
			})

			setTimeout(function() {
				locationHash.go('/route/thing with spaces')
			}, 50)
		})

		t.timeoutAfter(4000)
	})

	test('reverse order is respected for evaluateCurrent()', function(t) {
		// https://github.com/TehShrike/hash-brown-router/issues/8
		startTest(function(getRoute) {
			var route = getRoute({ reverse: true })

			locationHash.go('/route/butts')

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
				route.evaluateCurrent('/wat')
			}, 50)
		})

		t.timeoutAfter(4000)
	})

	test('Go to one url, then go to another url', function(t) {
		startTest(function(getRoute) {
			var route = getRoute()

			route.add('/some-place', function() {
				t.pass('the first route was called')
				setTimeout(function() {
					route.go('/some-place-else')
				}, 50)
			})

			route.add('/some-place-else', function() {
				t.pass('the second route was called')
				setTimeout(function() {
					route.go('/yet-another-place')
				}, 50)
			})

			route.add('/yet-another-place', function() {
				t.pass('the third route was called')
				route.stop()
				t.end()
			})

			setTimeout(function() {
				route.go('/some-place')
			}, 50)
		})

		t.timeoutAfter(4000)
	})

	test('Navigating to the same url is a no-op', function(t) {
		startTest(function(getRoute) {
			var route = getRoute()
			var timesFirstRouteCalled = 0

			route.add('/some-place', function() {
				timesFirstRouteCalled++

				if (timesFirstRouteCalled > 1) {
					t.fail('some-place route called more than once')
					t.end()
				} else {
					setTimeout(function() {
						route.go('/some-place')

						setTimeout(function() {
							t.equal(timesFirstRouteCalled, 1)
							t.end()
						}, 100)
					}, 100)
				}
			})

			route.add('/some-place-else', function() {
				t.pass('some-place-else was called')
				setTimeout(function() {
					route.go('/some-place')
				}, 100)
			})

			route.go('/some-place-else')
		})

		t.timeoutAfter(4000)
	})
}
