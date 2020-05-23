import { IRouter, IRoute } from 'express'

/**
 * Retreive a list of routes registered in the router stack
 * @param {IRouter} router The target router to retrieve from
 * @returns {[{method: string, path:string}]}
 */
export function listRoutes(router) {
	return router.stack.map(listRoute.bind(null, [], []))
						.flat(2)
						.filter(route => route != null);
}

/**
 * Recursive function to accumulate all paths registered in system
 * @param {[]} routes 		Accumulated routes
 * @param {[]} pathParent 	The parent path
 * @param {IRouter} layer 	The current middleware layer
 * @returns {[{method: string, path:string}]}
 */
function listRoute(routes = [], pathParent = [], layer) {
	if (layer.route)
		return routes.concat(layer.route.stack.map(listRoute.bind(null,  routes, pathParent.concat(parseRoute(layer.route.path))))).flat();
	else if (layer.name === 'router' && layer.handle.stack) 
		return routes.concat(layer.handle.stack.map(listRoute.bind(null, routes, pathParent.concat(parseRoute(layer.regexp))))).flat();
	else if (layer.method)
		return {
			method: layer.method.toUpperCase(),
			path  : pathParent.concat(parseRoute(layer.regexp)).filter(Boolean).join('/')
		};
	else
		return null;
}

/**
 * Parse registered routes to human readable format
 * @param {IRoute}   route 
 * @returns {string} String route path relative to parent
 */
function parseRoute(route) {
	if (typeof route === 'string') {
		return route.split('/');
	}
	else if (route.fast_slash) {
		return '';
	}
	else {
		var match = route.toString()
		.replace('\\/?', '')
		.replace('(?=\\/|$)', '$')
		.match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
		return match? match[1].replace(/\\(.)/g, '$1').split('/'): '<complex:' + route.toString() + '>';
	}
}