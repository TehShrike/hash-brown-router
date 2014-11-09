var test = require('tape')
var hashLocationMockFactory = require('../hash-location-mock')
var allTests = require('./all-tests')

allTests({
	add: function(name, fn) {
		test(name, function(t) {
			fn(t, hashLocationMockFactory(), t.end.bind(t))
		})
	}
})
