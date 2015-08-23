var allTests = require('./all-tests')
var tapBrowserColor = require('tap-browser-color')
var browserHashLocation = require('../hash-location.js')

var hashLocation = browserHashLocation(window)

allTests(hashLocation, 1000)

tapBrowserColor()
