var pathToRegexp = require('path-to-regexp-with-reversible-keys')
var qs = require('querystring')
var xtend = require('xtend')
var browserHashLocation = require('./hash-location.js')
var EventEmitter = require('events').EventEmitter
require('array.prototype.find')

function noop() {}

module.exports = function Router(opts, hashLocation) {
	var emitter = new EventEmitter()
	if (isHashLocation(opts)) {
		hashLocation = opts
		opts = null
	}

	opts = opts || {}

	if (!hashLocation) {
		hashLocation = browserHashLocation(window)
	}

	function onNotFound(path, queryStringParameters) {
		emitter.emit('not found', path, queryStringParameters)
	}

	var routes = []

	var onHashChange = evaluateCurrentPath.bind(null, routes, hashLocation, !!opts.reverse, onNotFound)

	hashLocation.on('hashchange', onHashChange)

	function stop() {
		hashLocation.removeListener('hashchange', onHashChange)
	}

	emitter.add = add.bind(null, routes)
	emitter.stop = stop
	emitter.evaluateCurrent = evaluateCurrentPathOrGoToDefault.bind(null, routes, hashLocation, !!opts.reverse, onNotFound)
	emitter.replace = hashLocation.replace
	emitter.go = hashLocation.go
	emitter.location = hashLocation

	return emitter
}

function evaluateCurrentPath(routes, hashLocation, reverse, onNotFound) {
	evaluatePath(routes, hashLocation.get(), reverse, onNotFound)
}

function getPathParts(path) {
	var chunks = path.split('?')
	return {
		path: chunks.shift(),
		queryString: qs.parse(chunks.join(''))
	}
}

function evaluatePath(routes, path, reverse, onNotFound) {
	var pathParts = getPathParts(path)
	path = pathParts.path
	var queryStringParameters = pathParts.queryString

	var matchingRoute = (reverse ? reverseArray(routes) : routes).find(''.match, path)

	if (matchingRoute) {
		var regexResult = matchingRoute.exec(path)
		var routeParameters = makeParametersObjectFromRegexResult(matchingRoute.keys, regexResult)
		var params = xtend(queryStringParameters, routeParameters)
		matchingRoute.fn(params)
	} else {
		onNotFound(path, queryStringParameters)
	}
}

function reverseArray(ary) {
	return ary.slice().reverse()
}

function makeParametersObjectFromRegexResult(keys, regexResult) {
	return keys.reduce(function(memo, urlKey, index) {
		memo[urlKey.name] = regexResult[index + 1]
		return memo
	}, {})
}

function add(routes, routeString, routeFunction) {
	if (typeof routeFunction !== 'function') {
		throw new Error('The router add function must be passed a callback function')
	}
	var newRoute = pathToRegexp(routeString)
	newRoute.fn = routeFunction
	routes.push(newRoute)
}

function evaluateCurrentPathOrGoToDefault(routes, hashLocation, reverse, onNotFound, defaultPath) {
	if (hashLocation.get()) {
		var routesCopy = routes.slice()

		evaluateCurrentPath(routesCopy, hashLocation, reverse, onNotFound)
	} else {
		hashLocation.go(defaultPath)
	}
}

function isHashLocation(hashLocation) {
	return hashLocation && hashLocation.go && hashLocation.replace && hashLocation.on
}
