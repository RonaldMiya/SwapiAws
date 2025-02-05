import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';

import { handler as userHandler } from '../src/infrastructure/entry/lambdas/insert-user-function';

jest.mock('@aws-sdk/client-dynamodb');

const dynamoDbMock = new DynamoDBClient();

test('should create a new user', async () => {
  const putMock = jest.spyOn(dynamoDbMock, 'send');

  const event: APIGatewayProxyEvent = {
    httpMethod: 'POST',
    path: '/almacenar',
    body: JSON.stringify({
      name: "Test",
      lastName: "Test",
      email: "test.test@gmail.com",
      password: 'my-password'
    }),
  } as any;

  const response = await userHandler(event);

  expect(response.statusCode).toBe(201);
});
