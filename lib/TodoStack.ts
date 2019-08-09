import cdk = require('@aws-cdk/core');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import apigw = require("@aws-cdk/aws-apigateway");
import lambda = require("@aws-cdk/aws-lambda");
import path = require("path");

export class TodoStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        var table = new dynamodb.Table(this, "todos", {
            partitionKey: {name: "id", type: dynamodb.AttributeType.STRING},
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            serverSideEncryption: true
        });

        var lambdaEnv = {
            TABLE_NAME: table.tableName
        };

        var getItemFunction = new lambda.Function(this, "getItemFunction", {
            code: lambda.Code.asset(path.join(__dirname, "../app/api/GetItems")),
            handler: "index.handler",
            runtime: lambda.Runtime.NODEJS_10_X,
            environment: lambdaEnv
        });

        var putItemFunction = new lambda.Function(this, "putItemFunction", {
            code: lambda.Code.asset(path.join(__dirname, "../app/api/PutItem")),
            handler: "index.handler",
            runtime: lambda.Runtime.NODEJS_10_X,
            environment: lambdaEnv
        });

        table.grantReadData(getItemFunction);
        table.grantWriteData(putItemFunction);
        
        var api = new apigw.LambdaRestApi(this, "API", {
            handler: getItemFunction,
            proxy: false,
            endpointTypes: [apigw.EndpointType.REGIONAL]
        });

        var itemsResource = api.root.addResource("items");
        itemsResource.addMethod("GET");
        itemsResource.addMethod("PUT", new apigw.LambdaIntegration(putItemFunction));
        this.addCorsOptions(itemsResource);
    }

    private addCorsOptions(apiResource: apigw.IResource) {
        apiResource.addMethod('OPTIONS', new apigw.MockIntegration({
            integrationResponses: [{
            statusCode: '200',
            responseParameters: {
                'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                'method.response.header.Access-Control-Allow-Origin': "'*'",
                'method.response.header.Access-Control-Allow-Credentials': "'false'",
                'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
            },
            }],
            passthroughBehavior: apigw.PassthroughBehavior.NEVER,
            requestTemplates: {
            "application/json": "{\"statusCode\": 200}"
            },
        }), {
            methodResponses: [{
            statusCode: '200',
            responseParameters: {
                'method.response.header.Access-Control-Allow-Headers': true,
                'method.response.header.Access-Control-Allow-Methods': true,
                'method.response.header.Access-Control-Allow-Credentials': true,
                'method.response.header.Access-Control-Allow-Origin': true,
            },  
            }]
        })
    }
}