var repoLib = require("../../lib/repo/repo"); 
var repoConfig = require("../../lib/config/repoConfig"); 
var portalLib = require("/lib/xp/portal");
var valueLib = require("/lib/xp/value");

var servicesLib = require("../servicesLib"); 

/**
 * Get get images from Repo 
 */
exports.get = function(req) {
	var data = req.params.data;
    
    
	if (data != undefined) {
		var result = getImageFile(data); 

		if(result === "NOT_FOUND") {
			return {
				status : 404, 
				message : "Not found"
			};
		}
		return {
			body: result,
			contentType: "image/jpeg"
		};

	} else {
		var result = servicesLib.getNodes("data.type = 'image'"); 

		if(result === "NOT_FOUND") {
			return {
				status : 404, 
				message : "Not found"
			};
		}

		return {
			body: {nodes: result},
			contentType: "application/json"
		};
	}

    
    
};



/** 
 * Add to repo 
 */
exports.post = function(req) {
	// log.info("post");
	var body = JSON.parse(req.body); 
	if(!body) {
		var message = "Missing/invalid image";
		return { status: 404, message: message };
	}

	var wasSuccessful = servicesLib.createNode(body).success; 
    
	if(wasSuccessful) {
		// log.info(body.file ? true : false);
		if(body.file){
			// log.info("Added image with file");

		} else {
			// log.info("Added image:" + JSON.stringify(body, null, 4)); 
		}
		return { 
			status: 200, 
			message: "" 
		};
	}
};




exports.delete = function (req){
    
	var body = JSON.parse(req.body);
	if (!body) {
		var message = "Missing/invalid image data in request";
		log.warning(message);
		return { 
			status: 404,
			message: message 
		};
	}

	var result = servicesLib.deleteNode("data.type = 'image' AND data.id = '" + body.id + "'");

	if(result === "NOT_FOUND") {
		return {
			status : 404, 
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
 * Replace image
 */
exports.put = function(req) {
    
	var body = {
		name: portalLib.getMultipartText("name"),
		id: portalLib.getMultipartText("id"),
		type: portalLib.getMultipartText("type"),
		source: portalLib.getMultipartText("source"),
		file: portalLib.getMultipartItem("file")
	};

    

	if (body.file && body.file.fileName && body.file.size > 0) {
		body.file = valueLib.binary("file" , portalLib.getMultipartStream("file"));
		body.source = null;
	}

	var repoConn = repoLib.getRepoConnection(repoConfig.name, repoConfig.branch);
	var hits = repoConn.query({
		query: "data.type = 'image' AND data.id = '" + body.id + "'"
	}).hits;

	if (!hits || hits.length < 1) {
		// log.info("Node was not found. Creating a new one");
		var wasSuccessful = servicesLib.createNode(body).success; 
    
		if(wasSuccessful) {
			if(body.file){
				// log.info("Added image ");
                
			} else {
				// log.info("Added image:" + JSON.stringify(body, null, 4)); 
			}
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
		node.data.name = body.name;
		if(body.file){
			node.data.file = body.file;
		} else {
			node.data.source = body.source;
		}
		return node; 
	};

	var result = repoConn.modify({
		key: ids[0], 
		editor : editor
	});
	repoConn.refresh();

	if(result){
		if(body.file){
			// log.info("PUT_IMAGE ");
		} else {
			// log.info("PUT_IMAGE "+ JSON.stringify(body, null, 4));
		}
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
				message: "Something went wrong when editing and image"
			}
		};
	}
};


function getImageFile(id){
	var repoConn = repoLib.getRepoConnection(repoConfig.name, repoConfig.branch);
	// log.info("id: " + id);
	var hits = repoConn.query({
		count: 1000,
		query: "data.type = 'image' AND data.id = " + "'" + id + "'"
	}).hits;
	// log.info("hits:" + hits.length);

	if(!hits || hits.length == 0){
		return "NOT_FOUND";
	}

	var key = hits[0].id;

	var stream = repoConn.getBinary({
		key: key,
		binaryReference: "file"
	});

	if(!stream){
		return "NOT_FOUND";
	}

	return stream;

}
