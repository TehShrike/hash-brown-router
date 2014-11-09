var pathToRegexp = require('path-to-regexp-with-reversible-keys')
var qs = require('querystring')
var xtend = require('xtend')
var browserHashLocation = require('./hash-location.js')

module.exports = function Router(hashLocation) {
	if (!hashLocation) {
		hashLocation = browserHashLocation()
	}

	var routes = []

	var onHashChange = evaluateCurrentPath.bind(null, routes, hashLocation)

	hashLocation.on('hashchange', onHashChange)

	function stop() {
		hashLocation.removeListener('hashchange', onHashChange)
	}

	return {
		add: add.bind(null, routes),
		stop: stop,
		evaluateCurrent: evaluateCurrentPathOrGoToDefault.bind(null, routes, hashLocation),
		setDefault: setDefault.bind(null, routes),
		replace: hashLocation.replace,
		go: hashLocation.go
	}
}

function evaluateCurrentPath(routes, hashLocation) {
	evaluatePath(routes, hashLocation.get())
}

function getPathParts(path) {
	var chunks = path.split('?')
	return {
		path: chunks.shift(),
		queryString: qs.parse(chunks.join(''))
	}
}

function evaluatePath(routes, path) {
	var pathParts = getPathParts(path)
	path = pathParts.path

	var matchingRoute = routes.reduce(function(found, route) {
		if (found) {
			return found
		} else {
			var matchingRegex = route.exec(path)
			if (matchingRegex) {
				return {
					regexResult: matchingRegex,
					route: route
				}
			}
		}
	}, null)

	var queryStringParameters = pathParts.queryString

	if (matchingRoute) {
		var routeParameters = makeParametersObjectFromRegexResult(matchingRoute.route.keys, matchingRoute.regexResult)
		var params = xtend(queryStringParameters, routeParameters)
		matchingRoute.route.fn(params)
	} else if (routes.defaultFn) {
		routes.defaultFn(path, queryStringParameters)
	}
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

function evaluateCurrentPathOrGoToDefault(routes, hashLocation, defaultPath) {
	if (hashLocation.get()) {
		evaluateCurrentPath(routes, hashLocation)
	} else {
		hashLocation.go(defaultPath)
	}
}

function setDefault(routes, defaultFn) {
	routes.defaultFn = defaultFn
}

