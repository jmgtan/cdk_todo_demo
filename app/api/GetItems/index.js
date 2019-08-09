const AWS = require("aws-sdk");

exports.handler = async (event) => {
    var tableName = process.env.TABLE_NAME;

    var params = {
        TableName: tableName
    };

    var ddb = new AWS.DynamoDB();
    var statusCode = 200;
    var body = null;

    try {
        var results = await ddb.scan(params).promise();
        var items = results.Items;
        body = [];
        for (var i=0;i<items.length;i++) {
            var item = items[i];
            body.push({
                id: item.id.S,
                item: item.item.S
            });
        }
    } catch (e) {
        statusCode = 500;
        body = {
            error_message: e.message
        }
    }

    return {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(body)
    };

}