var guillotineLib = require('/lib/guillotine');
var graphQlLib = require('/lib/graphql');

var schema = guillotineLib.createSchema();

exports.post = function (req) {
    log.info(req.body); 
    var body = JSON.parse(req.body);
    // var body = req.body;
    var result = graphQlLib.execute(schema, body.query, body.variables);
    return {
        contentType: 'application/json',
        body: result
    };
};
