import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";

import { getExpensesForCurrentUser } from "../../helpers/expenses";
import { getUserId } from "../utils";

import { createLogger } from "../../utils/logger";

const logger = createLogger("getExpenses");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event);
    const listExpenses = await getExpensesForCurrentUser(userId);
    logger.info("userId = ", { key: userId });
    logger.info("list expenses = ", { key: listExpenses });

    const notFound = !listExpenses || listExpenses.count === 0;

    if (notFound)
      return { statusCode: 404, body: JSON.stringify({ error: "List expenses not found" }) };

    return { statusCode: 200, body: JSON.stringify({ items: listExpenses.Items }) };
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
