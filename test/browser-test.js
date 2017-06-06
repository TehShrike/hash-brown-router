var allTests = require('./all-tests')
var browserTests = require('./browser-tests')
var tapBrowserColor = require('tap-browser-color')
var browserHashLocation = require('../hash-location.js')

var hashLocation = browserHashLocation(window)

var delayAfterInitialRouteChange = 1000
allTests(hashLocation, delayAfterInitialRouteChange)
browserTests(hashLocation, delayAfterInitialRouteChange)

tapBrowserColor()
