var router = require('../')
var tester = require('./jankety-test-harness')
var allTests = require('./all-tests')

allTests(tester)

tester.add('replacing a url', function(t, locationHash, done) {
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
		route.go('/redirect') // history length++
	}))

	route.add('/redirect', shouldHappenOnce('redirect route', function() {
		route.replace('/destination')
	}))

	route.add('/destination', shouldHappenOnce('destination route', function() {
		var historyDepth = history.length - startingHistoryLength
		t.equal(historyDepth, 2, 'should be two more items in the history then there were before (was ' + historyDepth + ')')
		done()
	}))

	route.setDefault(t.fail.bind(t, 'default route called'))

	route.go('/initial') // history length++
})

tester.start()

