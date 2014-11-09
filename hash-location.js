var EventEmitter = require('events').EventEmitter

module.exports = function HashLocation() {
	var emitter = new EventEmitter()

	function onHashChange() {
		emitter.emit('hashchange')
	}

	window.addEventListener('hashchange', onHashChange)

	emitter.go = go
	emitter.replace = replace
	emitter.get = get

	return emitter
}

function replace(newPath) {
	location.replace(location.origin + location.pathname + '#' + newPath)
}

function go(newPath) {
	location.hash = newPath
}

function get() {
	return removeHashFromPath(location.hash)
}

function removeHashFromPath(path) {
	return (path && path[0] === '#') ? path.substr(1) : path
}
