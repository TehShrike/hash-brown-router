var router = require('../')
var tester = require('./jankety-test-harness.js')

tester.add('routing on a simple url', function(t, done) {
	var route = router()

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

	location.hash = '/butts'

	setTimeout(function() {
		route.stop()
		done()
	}, 200)
})

tester.add('default function is called when nothing matches', function(t, done) {
	t.plan(2)

	var route = router()

	var fail = t.fail.bind(t, 'the wrong route was called')

	route.add('/butts', fail)
	route.add('/non-butts', fail)

	route.setDefault(function(path) {
		t.pass('the default route was called')
		t.equal('/lulz', path, 'the default path was passed in')
	})

	location.hash = '/lulz'

	setTimeout(function() {
		route.stop()
		done()
	}, 200)
})

tester.add('evaluating the current path instead of waiting for an onhashchange', function(t, done) {
	t.plan(1)

	location.hash = '/butts'

	setTimeout(function() {
		var route = router()

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
		route.evaluate()

		route.stop()

		done()
	}, 200)
})

tester.add('matching an express-style url, getting parameters back', function(t, done) {
	var route = router()

	t.plan(3)

	route.add('/no/way', t.fail.bind(t, 'the wrong route was called'))

	route.add('/my/:special', function(parameters) {
		t.equal(typeof parameters, 'object', 'parameters object is an object')
		t.equal(Object.keys(parameters).length, 1, 'parameters object has one property')
		t.equal(parameters.special, 'input')
	})

	location.hash = '/my/input'

	setTimeout(function() {
		route.stop()
		done()
	}, 200)
})

tester.add('route.evaluate calls the default route when the current path is empty', function(t, done) {
	var route = router()

	t.plan(2)

	route.add('/default', t.pass.bind(t, 'the default route was called'))
	route.add('/other', t.fail.bind(t, 'the wrong route was called'))

	route.evaluate('/default')

	setTimeout(function() {
		t.equal(location.hash, '#/default', 'the hash was set to the default from the route.evaluate call')
		route.stop()
		done()
	}, 200)
})

tester.add('route.evaluate does not call the default route when the current path is not empty', function(t, done) {
	location.hash = '/starting-path'

	t.plan(1)

	setTimeout(function() {
		var route = router()

		route.add('/default', t.fail.bind(t, 'the default route was called incorrectly'))
		route.add('/starting-path', t.pass.bind(t, 'the correct route was called'))

		route.evaluate('/default')

		setTimeout(function() {
			route.stop()
			done()
		}, 200)

	}, 100)

})

tester.add('parmeters include values from querystring', function(t, done) {
	t.plan(4)

	var route = router()

	route.add('myroute/:fromUrl', function(parameters) {
		t.equal(typeof parameters, 'object', 'parameters object is an object')
		t.equal(Object.keys(parameters).length, 2, 'parameters object has two properties')
		t.equal(parameters.fromUrl, 'value1', 'Value from the url parameter is correct')
		t.equal(parameters.fromQueryString, 'value2', 'Value from the query string is correct')
	})

	location.hash = 'myroute/value1?fromQueryString=value2'

	setTimeout(function() {
		route.stop()
		done()
	}, 200)
})

tester.add('parameters from route overwrite querystring parameters', function(t, done) {
	t.plan(3)

	var route = router()

	route.add('myroute/:fromUrl', function(parameters) {
		t.equal(typeof parameters, 'object', 'parameters object is an object')
		t.equal(Object.keys(parameters).length, 1, 'parameters object has one property')
		t.equal(parameters.fromUrl, 'value1', 'Value is from the route parameter')
	})

	location.hash = 'myroute/value1?fromUrl=value2'

	setTimeout(function() {
		route.stop()
		done()
	}, 200)
})

tester.add('querystring parameters passed to the default route', function(t, done) {
	var route = router()

	t.plan(3)

	route.setDefault(function(path, parameters) {
		t.equal(typeof parameters, 'object', 'parameters object is an object')
		t.equal(parameters.lol, 'wut', 'value from the querystring was passed in')
		t.equal(path, '/default', 'the /default path was correctly passed in')
	})

	route.evaluate('/default?lol=wut')

	setTimeout(function() {
		route.stop()
		done()
	}, 200)
})

tester.add('replacing a url', function(t) {
	t.plan(4)

	var route = router()

	var startingHistoryLength = history.length

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

	route.add('/initial', shouldHappenOnce('initial route', function() {
		location.hash = '/redirect' // history length++
	}))

	route.add('/redirect', shouldHappenOnce('redirect route', function() {
		route.replace('/destination')
	}))

	route.add('/destination', shouldHappenOnce('destination route', function() {
		var historyDepth = history.length - startingHistoryLength
		t.equal(historyDepth, 2, 'should be two more items in the history then there were before (was ' + historyDepth + ')')
		t.end()
	}))

	route.setDefault(t.fail.bind(t, 'default route called'))

	location.hash = '/initial' // history length++
})

tester.start()
