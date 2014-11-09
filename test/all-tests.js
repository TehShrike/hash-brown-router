var router = require('../')

module.exports = function tests(tester) {
	tester.add('routing on a simple url', function(t, locationHash, done) {
		var route = router(locationHash)

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

		locationHash.go('/butts')

		setTimeout(function() {
			route.stop()
			done()
		}, 200)
	})

	tester.add('default function is called when nothing matches', function(t, locationHash, done) {
		t.plan(2)

		var route = router(locationHash)

		var fail = t.fail.bind(t, 'the wrong route was called')

		route.add('/butts', fail)
		route.add('/non-butts', fail)

		route.setDefault(function(path) {
			t.pass('the default route was called')
			t.equal('/lulz', path, 'the default path was passed in')
		})

		locationHash.go('/lulz')

		setTimeout(function() {
			route.stop()
			done()
		}, 200)
	})

	tester.add('evaluating the current path instead of waiting for an onhashchange', function(t, locationHash, done) {
		t.plan(1)

		locationHash.go('/butts')

		setTimeout(function() {
			var route = router(locationHash)

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

			done()
		}, 200)
	})

	tester.add('matching an express-style url, getting parameters back', function(t, locationHash, done) {
		var route = router(locationHash)

		t.plan(3)

		route.add('/no/way', t.fail.bind(t, 'the wrong route was called'))

		route.add('/my/:special', function(parameters) {
			t.equal(typeof parameters, 'object', 'parameters object is an object')
			t.equal(Object.keys(parameters).length, 1, 'parameters object has one property')
			t.equal(parameters.special, 'input')
		})

		locationHash.go('/my/input')

		setTimeout(function() {
			route.stop()
			done()
		}, 200)
	})

	tester.add('route.evaluateCurrent calls the default route when the current path is empty', function(t, locationHash, done) {
		var route = router(locationHash)

		t.plan(2)

		route.add('/default', t.pass.bind(t, 'the default route was called'))
		route.add('/other', t.fail.bind(t, 'the wrong route was called'))

		route.evaluateCurrent('/default')

		setTimeout(function() {
			t.equal(locationHash.get(), '/default', 'the hash was set to the default from the route.evaluateCurrent call')
			route.stop()
			done()
		}, 200)
	})

	tester.add('route.evaluateCurrent does not call the default route when the current path is not empty', function(t, locationHash, done) {
		locationHash.go('/starting-path')

		t.plan(1)

		setTimeout(function() {
			var route = router(locationHash)

			route.add('/default', t.fail.bind(t, 'the default route was called incorrectly'))
			route.add('/starting-path', t.pass.bind(t, 'the correct route was called'))

			route.evaluateCurrent('/default')

			setTimeout(function() {
				route.stop()
				done()
			}, 200)

		}, 100)

	})

	tester.add('parmeters include values from querystring', function(t, locationHash, done) {
		t.plan(4)

		var route = router(locationHash)

		route.add('myroute/:fromUrl', function(parameters) {
			t.equal(typeof parameters, 'object', 'parameters object is an object')
			t.equal(Object.keys(parameters).length, 2, 'parameters object has two properties')
			t.equal(parameters.fromUrl, 'value1', 'Value from the url parameter is correct')
			t.equal(parameters.fromQueryString, 'value2', 'Value from the query string is correct')
		})

		locationHash.go('myroute/value1?fromQueryString=value2')

		setTimeout(function() {
			route.stop()
			done()
		}, 200)
	})

	tester.add('parameters from route overwrite querystring parameters', function(t, locationHash, done) {
		t.plan(3)

		var route = router(locationHash)

		route.add('myroute/:fromUrl', function(parameters) {
			t.equal(typeof parameters, 'object', 'parameters object is an object')
			t.equal(Object.keys(parameters).length, 1, 'parameters object has one property')
			t.equal(parameters.fromUrl, 'value1', 'Value is from the route parameter')
		})

		locationHash.go('myroute/value1?fromUrl=value2')

		setTimeout(function() {
			route.stop()
			done()
		}, 200)
	})

	tester.add('querystring parameters passed to the default route', function(t, locationHash, done) {
		var route = router(locationHash)

		t.plan(3)

		route.setDefault(function(path, parameters) {
			t.equal(typeof parameters, 'object', 'parameters object is an object')
			t.equal(parameters.lol, 'wut', 'value from the querystring was passed in')
			t.equal(path, '/default', 'the /default path was correctly passed in')
		})

		route.evaluateCurrent('/default?lol=wut')

		setTimeout(function() {
			route.stop()
			done()
		}, 200)
	})
}
