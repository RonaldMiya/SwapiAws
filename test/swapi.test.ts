import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

import { handler as userHandler } from '../lambdas/insert-customer-function';

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
      email: "test.test@gmail.com"
    }),
  } as any;

  const response = await userHandler(event);

  expect(putMock).toHaveBeenCalledWith(expect.any(PutCommand));
  expect(response.statusCode).toBe(201);
});
