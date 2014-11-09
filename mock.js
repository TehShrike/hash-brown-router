var Router = require('./')
var hashLocationMock = require('./hash-location-mock')

module.exports = function() {
	return Router(hashLocationMock())
}
