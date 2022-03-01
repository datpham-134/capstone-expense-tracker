import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import "source-map-support/register";
import { createExpense } from "../../helpers/expenses";
import { CreateExpenseRequest } from "../../requests/CreateExpenseRequest";
import { getUserId } from "../utils";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newExpense: CreateExpenseRequest = JSON.parse(event.body);
    const userId = getUserId(event);
    const expenseItemCreated = await createExpense(userId, newExpense);

    return { statusCode: 201, body: JSON.stringify({ item: expenseItemCreated }) };
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
