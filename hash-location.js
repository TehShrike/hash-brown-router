var EventEmitter = require('events').EventEmitter

module.exports = function HashLocation(window) {
	var emitter = new EventEmitter()
	var last = ''

	window.addEventListener('hashchange', function() {
		if (last !== emitter.get()) {
			last = emitter.get()
			emitter.emit('hashchange')
		}
	})

	emitter.go = go.bind(null, window)
	emitter.replace = replace.bind(null, window)
	emitter.get = get.bind(null, window)

	return emitter
}

function replace(window, newPath) {
	window.location.replace(window.location.origin + window.location.pathname + '#' + newPath)
}

function go(window, newPath) {
	window.location.hash = newPath
}

function get(window) {
	return removeHashFromPath(window.location.hash)
}

function removeHashFromPath(path) {
	return (path && path[0] === '#') ? path.substr(1) : path
}
