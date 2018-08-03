var guillotineLib = require('/lib/guillotine');
var graphQlLib = require('/lib/graphql');

var schema = guillotineLib.createSchema();

exports.post = function (req) {
	var body = JSON.parse(req.body);
	var result = graphQlLib.execute(schema, body.query, body.variables);
    
	// log.info(JSON.stringify(result.data, null, 4));

	if(!result.data.guillotine.query) {
		return {
			status : 404, 
			message : 'Not found'
		};
	} 
    
	return {
		contentType: 'application/json',
		body: result
	};
};
