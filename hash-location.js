var EventEmitter = require('eventemitter3')

module.exports = function HashLocation(window) {
	var emitter = new EventEmitter()
	var last = ''
	var needToDecode = getNeedToDecode()

	window.addEventListener('hashchange', function() {
		if (last !== emitter.get()) {
			last = emitter.get()
			emitter.emit('hashchange')
		}
	})

	emitter.go = go.bind(null, window)
	emitter.replace = replace.bind(null, window)
	emitter.get = get.bind(null, window, needToDecode)

	return emitter
}

function replace(window, newPath) {
	window.location.replace(everythingBeforeTheSlash(window.location.href) + '#' + newPath)
}

function everythingBeforeTheSlash(url) {
	var hashIndex = url.indexOf('#')
	return hashIndex === -1 ? url : url.substring(0, hashIndex)
}

function go(window, newPath) {
	window.location.hash = newPath
}

function get(window, needToDecode) {
	var hash = removeHashFromPath(window.location.hash)
	return needToDecode ? decodeURI(hash) : hash
}

function removeHashFromPath(path) {
	return (path && path[0] === '#') ? path.substr(1) : path
}

function getNeedToDecode() {
	var a = document.createElement('a')
	a.href = '#x x'
	return !/x x/.test(a.hash)
}
