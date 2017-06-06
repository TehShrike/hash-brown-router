var makeRouter = require('../')
var test = require('tape-catch')

module.exports = function tests(locationHash, delayAfterInitialRouteChange) {
	function getRoute(options) {
		return options ? makeRouter(options, locationHash) : makeRouter(locationHash)
	}

	test('browser back button triggers a hashchange', function(t) {
		t.timeoutAfter(4000)
		locationHash.go('')
		setTimeout(function() {
			var route = getRoute()
			var originVisits = 0
			var otherPlaceVisits = 0

			route.add('/origin', function() {
				originVisits++
				if (originVisits === 1) {
					setTimeout(function() {
						locationHash.go('/other-place')
					}, delayAfterInitialRouteChange)
				} else {
					t.equal(originVisits, 2, 'Second visit to the origin route')
					route.stop()
					t.end()
				}
			})

			route.add('/other-place', function() {
				otherPlaceVisits++
				if (otherPlaceVisits === 1) {
					setTimeout(function() {
						window.history.back()
					}, delayAfterInitialRouteChange)
				} else {
					t.fail()
				}
			})

			locationHash.go('/origin')
		}, delayAfterInitialRouteChange)
	})
}
