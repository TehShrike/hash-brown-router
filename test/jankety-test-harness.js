var domready = require('domready')
var tapBrowserColor = require('tap-browser-color')
var browserHashLocation = require('../hash-location.js')
var test = require('tape').test

var allTests = []

function addTest(description, fn) {
	allTests.push({
		description: description,
		fn: fn
	})
}

var queuedUp = []

var testIsRunning = false
var domIsReady = false
var tapStarted = false
function startIfNecessary() {
	if (!testIsRunning && domIsReady && tapStarted) {
		testIsRunning = true
		runNext()
	}
}

function runNext() {
	var next = queuedUp.shift()
	if (next) {
		next()
	} else {
		testIsRunning = false
	}
}

function start() {
	var hashLocation = browserHashLocation(window)
	allTests.forEach(function(next) {
		test(next.description, function(t) {
			tapStarted = true
			queuedUp.push(function() {
				hashLocation.go('')
				process.nextTick(function() {
					next.fn(t, hashLocation, function() {
						t.end()
						runNext()
					})
				})
			})
			startIfNecessary()
		})
	})
}

domready(function() {
	tapBrowserColor()
	domIsReady = true
	startIfNecessary()
})

module.exports = {
	add: addTest,
	start: start
}
