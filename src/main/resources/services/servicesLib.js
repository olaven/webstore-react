/**
 * A common library for all the services in this folder 
 */

var repoLib = require('../../lib/repo/repo');
var repoConfig = require('../../lib/config/repoConfig');
var portalLib = require('/lib/xp/portal');
var valueLib = require('/lib/xp/value');

/**
 * Delete the repo-nodes that return with the give query
 * @param query to filter on
 */
var deleteNode = function (query) {

	var repoConn = repoLib.getRepoConnection(repoConfig.name, repoConfig.branch);

	var hits = repoConn.query({
		query: query
	}).hits;

	if (!hits || hits.length < 1) {
		return 'NOT_FOUND';
	}

	hits.map(function (hit) {
		return repoConn.delete(hit.id);
	});

	repoConn.refresh();

	return { success: true };
};

/**
 * Creates a node in the repo, with given data
 * @param data the data to create node with
 */
var createNode = function (data) {
	try {
		var node = repoLib.storeItemAndCreateNode(
			data,
			repoConfig
		);
		if (!node) {
			log.error(
				'Tried creating node, but something seems wrong: ' +
                JSON.stringify(
                	{
                		incoming_item: data,
                		resulting_node: node
                	},
                	null,
                	2
                )
			);

			return {
				status: 500,
				message: 'Could not create node'
			};
		} else {
			return { success: true };
		}
	} catch (e) {
		return {
			status: 500,
			message: 'Couldn\'t create node'
		};
	}
};

/**
 * gets all noes that return on query
 * @param {string} query 
 */
var getNodes = function (query) {

	var repoConn = repoLib.getRepoConnection(repoConfig.name, repoConfig.branch);
	var hits = repoConn.query({
		count: 1000,
		query: query
	}).hits;
	if (!hits || hits.length < 1) {
		return hits;
	}

	var nodes = hits.map(function (hit) {
		return repoConn.get(hit.id);
	});

	if (nodes) {
		return nodes;
	} else {
		return 'NOT_FOUND';
	}
};


module.exports = {
	deleteNode : deleteNode, 
	createNode : createNode, 
	getNodes : getNodes
};


/**
 * Adds an item to repo 
 * @param item 
 */
