var repoLib = require("../../lib/repo/repo"); 
var repoConfig = require("../../lib/config/repoConfig"); 

var servicesLib = require("../servicesLib"); 
/**
 * Get get categories from Repo 
 */
exports.get = function(req) {
	// log.info("GET CATEGORY");
	var result = servicesLib.getNodes("data.type = 'category'"); 

	if(result === "NOT_FOUND") {
		return {
			status : 404, 
			message : "Not found"
		};
	} 
		
	return {
		body: {nodes : result},
		headers: {
			"Content-Type": "application/json"
		}

	};
    
};

 
/** 
 * Add to repo 
 */
exports.post = function(req) {
	var body = JSON.parse(req.body); 
	if(!body) {
		var message = "Missing/invalid body";
		return { status: 400, message: message };
	}

	var wasSuccessful = servicesLib.createNode(body).success; 
    
	if(wasSuccessful) {
		// log.info("Added Category:" + JSON.stringify(body, null, 4)); 
		return { 
			status: 200, 
			message: "" 
		};
	}
};




exports.delete = function (req){
    
	// log.info(JSON.stringify(req, null, 2));
	var body = JSON.parse(req.body);
	if (!body) {
		var message = "Missing/invalid node data in request";
		log.warning(message);
		return { 
			status: 400,
			message: message 
		};
	}

	var result = servicesLib.deleteNode("data.type = 'category' AND data.id = " + body.id);

	if(result === "NOT_FOUND") {
		return {
			status : 400, 
			message : "Not found"
		};
	} else {
		return {
			body: {result: result},
			headers: {
				"Content-Type": "application/json"
			}
		};
	}
};

/**
 * Replace category
 */
exports.put = function(req) {
	// log.info("PUT CATEGORY");
	var body = JSON.parse(req.body);
	var repoConn = repoLib.getRepoConnection(repoConfig.name, repoConfig.branch);
	var hits = repoConn.query({
		query: "data.type = 'category' AND data.id = " + body.id 
	}).hits;

	if (!hits || hits.length < 1) {
		// log.info("Node was not found. Creating a new one");
		var wasSuccessful = servicesLib.createNode(body).success; 
    
		if(wasSuccessful) {
			// log.info("Added node:" + JSON.stringify(body, null, 4)); 
			return { 
				status: 200, 
				message: "" 
			};
		}
	}

	var ids = hits.map(function (hit) {
		return hit.id;
	}); 

	var editor = function(node) {
		node.data.title = body.title;
		node.data.filter = body.filter;
		node.data.visible = body.visible;
		return node; 
	};

	var result = repoConn.modify({
		key: ids[0], 
		editor : editor
	});
	repoConn.refresh();

	if(result){
		return {
			body: {
				status: 200
			}
		};

	} else {
		// log.info("PUT ERROR");
		return {
			body: {
				status: 500,
				message: "Something went wrong when editing node"
			}
		};
	}
};
