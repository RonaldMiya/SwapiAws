import * as cdk from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class SwapiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    // TABLES

    const userTable = new Table(this, 'UserTable', {
      tableName: 'UserTable',
      partitionKey: { name: 'id', type: AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    const filmTable = new Table(this, 'FilmTable', {
      tableName: 'FilmTable',
      partitionKey: { name: 'id', type: AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    const mergeCacheTable = new Table(this, 'MergeCacheTable', {
      tableName: 'ApiMergeCacheTable',
      partitionKey: { name: 'cacheKey', type: AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      timeToLiveAttribute: 'ttl'
    });

    // LAMBDAS

    const SWAPIAPI = 'https://swapi.dev';
    const IMDBAPI = 'https://imdb.iamidiotareyoutoo.com';

    const userLambda = new NodejsFunction(this, 'UserLambda', {
      entry: 'lambdas/insert-customer-function.ts',
      runtime: Runtime.NODEJS_20_X,
      memorySize: 128,
      environment: {
        USER_TABLE: userTable.tableName
      }
    });

    const mergeLambda = new NodejsFunction(this, 'MergeLambda', {
      entry: 'lambdas/merge-function.ts',
      runtime: Runtime.NODEJS_20_X,
      memorySize: 128,
      timeout: cdk.Duration.seconds(15),
      environment: {
        CACHE_MERGE_TABLE: mergeCacheTable.tableName,
        FILM_TABLE: filmTable.tableName,
        SWAPIAPI,
        IMDBAPI
      }
    });

    const historyMergeLambda = new NodejsFunction(this, 'GetHistoryMergeLambda', {
      entry: 'lambdas/get-merge-function.ts',
      runtime: Runtime.NODEJS_20_X,
      memorySize: 128,
      environment: {
        FILM_TABLE: filmTable.tableName
      }
    });


    // ACCESOS

    mergeCacheTable.grantReadWriteData(mergeLambda);

    filmTable.grantReadWriteData(mergeLambda);
    filmTable.grantReadData(historyMergeLambda);

    userTable.grantReadWriteData(userLambda);

    // API GATEWAY

    const api = new RestApi(this, 'RestApi', {
      restApiName: 'RestApi'
    });

    const merges = api.root.addResource('fusionados');

    const merge = merges.addResource('{id}');
    merge.addMethod('GET', new LambdaIntegration(mergeLambda));

    const users = api.root.addResource('almacenar');
    users.addMethod('POST', new LambdaIntegration(userLambda));

    const film = api.root.addResource('historial');
    film.addMethod('GET', new LambdaIntegration(historyMergeLambda));
  }
}
