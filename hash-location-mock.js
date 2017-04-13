var EventEmitter = require('events')

module.exports = function HashLocationMock() {
	var emitter = new EventEmitter()
	var currentRoute = ''

	function onHashChange() {
		emitter.emit('hashchange')
	}

	emitter.go = function(newPath) {
		currentRoute = newPath
		onHashChange()
	}

	emitter.replace = emitter.go

	emitter.get = function get() {
		return currentRoute
	}

	return emitter
}
