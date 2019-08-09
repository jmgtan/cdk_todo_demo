var AWS = require("aws-sdk");
var uuid = require("uuid/v4");

exports.handler = async(event) => {
    var tableName = process.env.TABLE_NAME;
    var statusCode = 200;
    var body = null;

    if (event.body) {
        var payload = JSON.parse(event.body);
        if (payload.item) {
            var id = uuid();
            var params = {
                Item: {
                    id: {
                        S: id
                    },
                    item: {
                        S: payload.item
                    }
                },
                TableName: tableName
            }

            var ddb = new AWS.DynamoDB();
            await ddb.putItem(params).promise();
            body = {
                id: id
            }
        } else {
            statusCode = 400;
            body = {error_message: "Missing item"};
        }
    } else {
        statusCode = 400;
        body = {error_message: "Missing payload"};
    }

    return {
        statusCode: 200,
        body: JSON.stringify(body)
    }
}