import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";
import "source-map-support/register";
import { deleteExpense } from "../../helpers/expenses";
import { getUserId } from "../utils";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    const { expenseId } = event.pathParameters;
    await deleteExpense(userId, expenseId);

    return {
      statusCode: 200,
      body: JSON.stringify(true),
    };
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
