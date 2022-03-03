import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import 'source-map-support/register'
import { updateExpense } from '../../businessLogic/expenses'
import { UpdateExpenseRequest } from '../../requests/UpdateExpenseRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const { expenseId } = event.pathParameters
    const updatedExpense: UpdateExpenseRequest = JSON.parse(event.body)
    await updateExpense(userId, expenseId, updatedExpense)

    return {
      statusCode: 200,
      body: JSON.stringify(true)
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
