import * as cdk from 'aws-cdk-lib';
import { ApiKey, ApiKeySourceType, Cors, LambdaIntegration, RestApi, UsagePlan } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Key } from 'aws-cdk-lib/aws-kms';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class SwapiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const kmsKey = new Key(this, 'swapiStackKey', {
      enableKeyRotation: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

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

    const cacheTable = new Table(this, 'CacheTable', {
      tableName: 'CacheTable',
      partitionKey: { name: 'cacheKey', type: AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      timeToLiveAttribute: 'ttl'
    });

    // LAMBDAS

    const SWAPIAPI = 'https://swapi.dev';
    const IMDBAPI = 'https://imdb.iamidiotareyoutoo.com';

    const userLambda = new NodejsFunction(this, 'UserLambda', {
      entry: 'src/infrastructure/entry/lambdas/insert-user-function.ts',
      runtime: Runtime.NODEJS_20_X,
      memorySize: 128,
      environment: {
        KMS_KEY_ID: kmsKey.keyId,
        USER_TABLE: userTable.tableName,
      }
    });

    const mergeLambda = new NodejsFunction(this, 'MergeLambda', {
      entry: 'src/infrastructure/entry/lambdas/merge-function.ts',
      runtime: Runtime.NODEJS_20_X,
      memorySize: 128,
      timeout: cdk.Duration.seconds(15),
      environment: {
        CACHE_TABLE: cacheTable.tableName,
        FILM_TABLE: filmTable.tableName,
        SWAPIAPI,
        IMDBAPI
      }
    });

    const historyLambda = new NodejsFunction(this, 'HistoryLambda', {
      entry: 'src/infrastructure/entry/lambdas/history-function.ts',
      runtime: Runtime.NODEJS_20_X,
      memorySize: 128,
      environment: {
        FILM_TABLE: filmTable.tableName
      }
    });

    // ACCESOS

    cacheTable.grantReadWriteData(mergeLambda);

    filmTable.grantReadWriteData(mergeLambda);
    filmTable.grantReadData(historyLambda);

    kmsKey.grantEncrypt(userLambda);
    userTable.grantReadWriteData(userLambda);

    // API GATEWAY

    const api = new RestApi(this, 'RestApi', {
      restApiName: 'RestApi',
      apiKeySourceType: ApiKeySourceType.HEADER
    });

    const apiKey = new ApiKey(this, 'SwapiKey');

    const usagePlan = new UsagePlan(this, 'SwapiUsagePlan', {
      name: 'SwapiUsagePlan',
      apiStages: [
        {
          api,
          stage: api.deploymentStage
        }
      ],
      throttle: {
        rateLimit: 2,
        burstLimit: 1
      }
    });

    usagePlan.addApiKey(apiKey);

    const merges = api.root.addResource('fusionados');

    const merge = merges.addResource('{id}');
    merge.addMethod('GET', new LambdaIntegration(mergeLambda), {
      apiKeyRequired: true
    });

    const user = api.root.addResource('almacenar');
    user.addMethod('POST', new LambdaIntegration(userLambda));

    const history = api.root.addResource('historial');
    history.addMethod('GET', new LambdaIntegration(historyLambda));

    // Misc: Outputs
    new cdk.CfnOutput(this, 'SwapiAPIKey', {
      value: apiKey.keyId,
    });
  }
}
