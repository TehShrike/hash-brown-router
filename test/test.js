var router = require('../')
var tester = require('./jankety-test-harness.js')

tester.add('routing on a simple url', function(t, done) {
	console.log('starting the first')
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
		console.log('done with the first')
		done()
	}, 500)
})

tester.add('default function is called when nothing matches', function(t, done) {
	t.plan(1)

	console.log('starting the second')
	var route = router()

	var fail = t.fail.bind(t, 'the wrong route was called')

	route.add('/butts', fail)
	route.add('/non-butts', fail)

	route.setDefault(function() {
		t.pass('the default route was called')
	})

	location.hash = '/lulz'

	setTimeout(function() {
		console.log('done with the second')
		route.stop()
		done()
	}, 500)
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

		route.go()
		route.stop()

		done()
	}, 500)
})

tester.start()
