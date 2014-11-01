var pathToRegexp = require('path-to-regexp-with-reversible-keys')

function removeHashFromPath(path) {
	return path && path.substr(1)
}

function add(routes, routeString, routeFunction) {
	if (typeof routeFunction !== 'function') {
		throw new Error('The router add function must be passed a callback function')
	}
	var newRoute = pathToRegexp(routeString)
	newRoute.fn = routeFunction
	routes.push(newRoute)
}

function makeParametersObject(keys, regexResult) {
	return keys.reduce(function(memo, urlKey, index) {
		memo[urlKey.name] = regexResult[index + 1]
		return memo
	}, {})
}

function evaluatePath(routes, path) {
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

	if (matchingRoute) {
		var params = makeParametersObject(matchingRoute.route.keys, matchingRoute.regexResult)
		matchingRoute.route.fn(params)
	} else if (routes.defaultFn) {
		routes.defaultFn(path)
	}
}

function evaluateCurrentPath(routes) {
	evaluatePath(routes, removeHashFromPath(location.hash))
}

function go(routes, defaultPath) {
	if (location.hash) {
		evaluateCurrentPath(routes)
	} else {
		evaluatePath(routes, defaultPath)
	}
}

function setDefault(routes, defaultFn) {
	routes.defaultFn = defaultFn
}

module.exports = function Router() {
	var routes = []

	var onHashChange = evaluateCurrentPath.bind(null, routes)

	window.addEventListener('hashchange', onHashChange)

	function stop() {
		window.removeEventListener('hashchange', onHashChange)
	}

	return {
		add: add.bind(null, routes),
		stop: stop,
		go: go.bind(null, routes),
		setDefault: setDefault.bind(null, routes)
	}
}
