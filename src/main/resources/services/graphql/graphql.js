var guillotineLib = require('/lib/guillotine');
var graphQlLib = require('/lib/graphql');

var schema = guillotineLib.createSchema();

exports.post = function (req) {
    var body = JSON.parse(req.body);
    log.info(JSON.stringify(body, null, 4)); 

    // var body = req.body;
    var result = graphQlLib.execute(schema, body.query, body.variables);
    return {
        contentType: 'application/json',
        body: result
    };
};
